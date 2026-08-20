import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/guard";
import { PERMISSIONS } from "@/lib/permissions";
import * as xlsx from "xlsx";
import PDFDocument from "pdfkit-table";
import fs from "fs";
import path from "path";

// Fix pdfkit font loading in Next.js Server / Turbopack environment
const originalReadFileSync = fs.readFileSync;
if (!(fs as any).__pdfkit_patched) {
  (fs as any).__pdfkit_patched = true;
  (fs as any).readFileSync = function (filePath: any, options: any) {
    if (typeof filePath === "string" && !fs.existsSync(filePath) && (filePath.includes("node_modules") || filePath.includes("C:\\ROOT"))) {
      const normalized = filePath.replace(/^.*?[\\/]node_modules[\\/]/, "node_modules/");
      const resolved = path.join(/*turbopackIgnore: true*/ process.cwd(), normalized);
      if (fs.existsSync(resolved)) {
        return originalReadFileSync.call(fs, resolved, options);
      }
    }
    return originalReadFileSync.call(fs, filePath, options);
  };
}

// Helper to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export async function GET(req: Request) {
  try {
    // 1. Authentication & Authorization check (LEADS_EXPORT required)
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.LEADS_EXPORT,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    // 2. Parse query params
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");
    const search = searchParams.get("search")?.toLowerCase() || "";

    if (!format || !["excel", "csv", "pdf"].includes(format)) {
      return NextResponse.json({ error: "Invalid format specified" }, { status: 400 });
    }

    // 3. Fetch data from DB based on filters
    const leads = await prisma.lead.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { company: { contains: search, mode: "insensitive" } },
              { source: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    const timestamp = new Date().toISOString().split("T")[0];
    const filenameBase = `buzzspire-leads-${timestamp}`;

    // Map data for export
    const mappedData = leads.map(lead => ({
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone || "N/A",
      Company: lead.company || "N/A",
      Budget: lead.budget || "N/A",
      Service: lead.service || "N/A",
      Source: lead.source || "N/A",
      PageUrl: lead.pageUrl || "N/A",
      Portfolio: lead.portfolio || "N/A",
      Message: lead.message,
      Status: lead.status,
      "Submitted Date": formatDate(lead.createdAt),
    }));

    // 4. Generate Export
    if (format === "csv") {
      // Manual CSV generation
      const headers = ["Name", "Email", "Phone", "Company", "Budget", "Service", "Source", "PageUrl", "Portfolio", "Message", "Status", "Submitted Date"];
      const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;
      
      const csvRows = [
        headers.join(","),
        ...mappedData.map(row => 
          [row.Name, row.Email, row.Phone, row.Company, row.Budget, row.Service, row.Source, row.PageUrl, row.Portfolio, row.Message, row.Status, row["Submitted Date"]]
            .map(val => escapeCsv(String(val)))
            .join(",")
        )
      ];
      
      const csvContent = csvRows.join("\n");
      
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filenameBase}.csv"`,
        },
      });
    }

    if (format === "excel") {
      const worksheet = xlsx.utils.json_to_sheet(mappedData);
      
      // Auto-size columns slightly
      const colWidths = [
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 20 }, // Company
        { wch: 15 }, // Budget
        { wch: 15 }, // Service
        { wch: 15 }, // Source
        { wch: 20 }, // PageUrl
        { wch: 25 }, // Portfolio
        { wch: 50 }, // Message
        { wch: 15 }, // Status
        { wch: 20 }, // Date
      ];
      worksheet["!cols"] = colWidths;

      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Leads");
      
      const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

      return new NextResponse(excelBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filenameBase}.xlsx"`,
        },
      });
    }

    if (format === "pdf") {
      // PDF generation stream wrapper
      const stream = await new Promise<Buffer>((resolve, reject) => {
        try {
          const doc = new PDFDocument({ margin: 30, size: "A4" });
          const buffers: Buffer[] = [];
          
          doc.on("data", buffers.push.bind(buffers));
          doc.on("end", () => resolve(Buffer.concat(buffers)));
          doc.on("error", reject);

          // Header branding
          doc.fontSize(20).text("Buzzspire Media", { align: "center" });
          doc.fontSize(14).text("Leads Report", { align: "center" });
          doc.moveDown();
          
          doc.fontSize(10).text(`Report Date: ${new Date().toLocaleDateString()}`);
          doc.text(`Total Leads: ${leads.length}`);
          if (search) doc.text(`Applied Filter: "${search}"`);
          doc.moveDown();

          // Prepare table
          const table = {
            title: "Lead Submissions",
            headers: ["Name", "Email", "Phone", "Company", "Service", "Source", "Message", "Status", "Date"],
            rows: leads.map(l => [
              l.name,
              l.email,
              l.phone || "-",
              l.company || "-",
              l.service || "-",
              l.source || "-",
              l.message, // Will automatically wrap in pdfkit-table
              l.status,
              formatDate(l.createdAt)
            ]),
          };

          // Generate table
          doc.table(table, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
            prepareRow: () => doc.font("Helvetica").fontSize(8),
          });

          doc.end();
        } catch (error) {
          reject(error);
        }
      });

      return new NextResponse(stream as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filenameBase}.pdf"`,
        },
      });
    }

  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 });
  }
}
