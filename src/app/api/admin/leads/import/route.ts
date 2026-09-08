import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredAnyPermission: [PERMISSIONS.LEADS_EDIT, PERMISSIONS.LEADS_VIEW],
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return ApiResponse.badRequest("No file provided");
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet, { defval: "" }) as any[];

    if (!rawData || rawData.length === 0) {
      return ApiResponse.badRequest("The uploaded file is empty");
    }

    let validCount = 0;
    let invalidCount = 0;
    let skippedCount = 0;
    const errors: any[] = [];
    const leadsToCreate: any[] = [];
    const assignedEmployeeId = auth.user.role === "ADMIN" ? null : auth.user.id;

    // Mapping headers intuitively
    const mapColumn = (row: any, possibleKeys: string[]) => {
      for (const key of possibleKeys) {
        if (row[key] !== undefined && row[key] !== "") return String(row[key]).trim();
      }
      return null;
    };

    // Pre-fetch existing emails/phones for the assigned employee to skip duplicates
    const existingLeads = await prisma.lead.findMany({
      where: assignedEmployeeId ? { assignedEmployeeId } : {},
      select: { email: true, phone: true }
    });

    const existingEmails = new Set(existingLeads.map(l => l.email).filter(Boolean));
    const existingPhones = new Set(existingLeads.map(l => l.phone).filter(Boolean));

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const name = mapColumn(row, ["Name", "Full Name", "First Name", "Lead Name"]);
      const email = mapColumn(row, ["Email", "Email Address", "Contact Email"]);
      const phone = mapColumn(row, ["Phone", "Phone Number", "Mobile", "Contact Number"]);
      const company = mapColumn(row, ["Company", "Company Name", "Organization"]);
      const message = mapColumn(row, ["Message", "Customer Message", "Notes"]);
      const service = mapColumn(row, ["Service", "Feature", "Category", "Lead Type"]);
      const budget = mapColumn(row, ["Budget", "Expected Budget"]);
      const source = mapColumn(row, ["Source", "Lead Source"]) || "Bulk Import";

      // Since all fields are optional, we only check if the row is entirely empty
      if (!name && !email && !phone && !company && !message) {
        invalidCount++;
        errors.push({ row: i + 2, reason: "Row is entirely empty of useful data" });
        continue;
      }

      // Check for duplicates
      if (email && existingEmails.has(email)) {
        skippedCount++;
        continue;
      }
      if (phone && existingPhones.has(phone)) {
        skippedCount++;
        continue;
      }

      validCount++;
      leadsToCreate.push({
        name,
        email,
        phone,
        company,
        message,
        service,
        budget,
        source,
        assignedEmployeeId,
        status: "NEW"
      });
      
      // Update sets to prevent duplicates within the file itself
      if (email) existingEmails.add(email);
      if (phone) existingPhones.add(phone);
    }

    if (leadsToCreate.length > 0) {
      await prisma.lead.createMany({
        data: leadsToCreate
      });
    }

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalRows: rawData.length,
          validImported: validCount,
          skippedDuplicates: skippedCount,
          invalidRows: invalidCount,
          errors
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error importing leads:", error);
    return ApiResponse.serverError("Error importing leads", error);
  }
}
