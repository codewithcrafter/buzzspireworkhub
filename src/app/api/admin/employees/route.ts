import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS, sanitizePermissions } from "@/lib/permissions";

/**
 * Auto-generate next Employee ID in sequence (EMP-1001, EMP-1002, etc.)
 */
async function generateNextEmployeeId(): Promise<string> {
  const latestEmployee = await prisma.user.findFirst({
    where: {
      employeeId: {
        startsWith: "EMP-",
      },
    },
    orderBy: {
      employeeId: "desc",
    },
    select: {
      employeeId: true,
    },
  });

  if (!latestEmployee || !latestEmployee.employeeId) {
    return "EMP-1001";
  }

  const match = latestEmployee.employeeId.match(/^EMP-(\d+)$/i);
  if (match) {
    const nextNumber = parseInt(match[1], 10) + 1;
    return `EMP-${nextNumber}`;
  }

  // Fallback random suffix
  return `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
}

// GET /api/admin/employees
export async function GET(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.EMPLOYEES_VIEW,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim();
    const role = searchParams.get("role")?.trim();

    const where: any = {
      role: role ? (role as any) : { in: ["EMPLOYEE", "ADMIN", "EDITOR"] },
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { employeeId: { contains: search, mode: "insensitive" } },
      ];
    }

    const employees = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
        employeeProfile: {
          select: {
            designation: true,
            salary: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            assignedLeads: true,
          },
        },
      },
    });

    const sanitized = employees.map((emp) => ({
      id: emp.id,
      employeeId: emp.employeeId,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      status: emp.status,
      permissions: emp.permissions,
      createdAt: emp.createdAt,
      updatedAt: emp.updatedAt,
      department: emp.employeeProfile?.department?.name || null,
      designation: emp.employeeProfile?.designation || null,
      salary: auth.user.role === "ADMIN" ? emp.employeeProfile?.salary : null,
      assignedLeadsCount: emp._count.assignedLeads,
    }));

    return NextResponse.json(
      {
        success: true,
        employees: sanitized,
        count: sanitized.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch employees error:", error);
    return ApiResponse.serverError("Error fetching employee roster", error);
  }
}

// POST /api/admin/employees
export async function POST(req: Request) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.EMPLOYEES_MANAGE,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const body = await req.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password;
    let employeeId = (body.employeeId || "").trim().toUpperCase();
    const phone = body.phone ? String(body.phone).trim() : null;
    const role = body.role === "ADMIN" ? "ADMIN" : "EMPLOYEE";
    const status = body.status === "INACTIVE" ? "INACTIVE" : "ACTIVE";
    const permissions = sanitizePermissions(body.permissions);
    const designation = body.designation ? String(body.designation).trim() : null;
    const departmentName = body.department ? String(body.department).trim() : null;

    if (!name || !email || !password) {
      return ApiResponse.badRequest("Name, email, and password are required");
    }

    if (password.length < 6) {
      return ApiResponse.badRequest("Password must be at least 6 characters long");
    }

    // Check email uniqueness
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return ApiResponse.badRequest("An account with this email address already exists");
    }

    // Hash password securely with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find or create department if requested
    let departmentId: string | null = null;
    if (departmentName) {
      const dept = await prisma.department.upsert({
        where: { name: departmentName },
        update: {},
        create: { name: departmentName },
      });
      departmentId = dept.id;
    }

    let newEmployee = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (!newEmployee && attempts < maxAttempts) {
      attempts++;
      try {
        let currentEmployeeId = employeeId;
        
        // If employeeId is not provided by user, generate one on each attempt to avoid collision
        if (!body.employeeId || !body.employeeId.trim()) {
           currentEmployeeId = await generateNextEmployeeId();
        } else {
           // If user provided a custom ID, only check it once.
           if (attempts === 1) {
               const existingId = await prisma.user.findFirst({
                 where: {
                   employeeId: { equals: currentEmployeeId, mode: "insensitive" },
                 },
               });
               if (existingId) {
                 return ApiResponse.badRequest(`Employee ID '${currentEmployeeId}' is already assigned`);
               }
           }
        }

        // Create user and employee profile
        newEmployee = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            employeeId: currentEmployeeId,
            phone,
            role: role as any,
            status: status as any,
            permissions,
            employeeProfile: {
              create: {
                designation,
                departmentId,
                salary: body.salary ? parseFloat(body.salary) : null,
              },
            },
          },
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            permissions: true,
            createdAt: true,
            updatedAt: true,
            employeeProfile: {
              select: {
                designation: true,
                department: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });
      } catch (error: any) {
        // P2002 is Prisma's unique constraint violation error code
        if (error.code === 'P2002' && error.meta?.target?.includes('employeeId')) {
           // If the user provided a custom ID that collided, don't retry, just return error
           if (body.employeeId && body.employeeId.trim()) {
               return ApiResponse.badRequest(`Employee ID '${body.employeeId}' is already assigned`);
           }
           // Otherwise, it was auto-generated, so we loop and try again
           if (attempts >= maxAttempts) {
               return ApiResponse.serverError("Failed to generate unique employee ID after multiple attempts", error);
           }
           continue;
        }
        throw error;
      }
    }

    if (!newEmployee) {
        return ApiResponse.serverError("Failed to create employee due to unknown error", null);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully",
        employee: {
          id: newEmployee.id,
          employeeId: newEmployee.employeeId,
          name: newEmployee.name,
          email: newEmployee.email,
          phone: newEmployee.phone,
          role: newEmployee.role,
          status: newEmployee.status,
          permissions: newEmployee.permissions,
          createdAt: newEmployee.createdAt,
          updatedAt: newEmployee.updatedAt,
          designation: newEmployee.employeeProfile?.designation || null,
          department: newEmployee.employeeProfile?.department?.name || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create employee error:", error);
    return ApiResponse.serverError("Error creating employee account", error);
  }
}
