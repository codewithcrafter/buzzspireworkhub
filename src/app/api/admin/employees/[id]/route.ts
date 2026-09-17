import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateRequest } from "@/lib/guard";
import { ApiResponse } from "@/lib/api-response";
import { PERMISSIONS, sanitizePermissions } from "@/lib/permissions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/employees/[id]
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.EMPLOYEES_VIEW,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;

    const employee = await prisma.user.findUnique({
      where: { id },
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
            monthlySalary: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        assignedLeads: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            assignedLeads: true,
          },
        },
      },
    });

    if (!employee) {
      return ApiResponse.notFound("Employee not found");
    }

    return NextResponse.json(
      {
        success: true,
        employee: {
          id: employee.id,
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          role: employee.role,
          status: employee.status,
          permissions: employee.permissions,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
          department: employee.employeeProfile?.department?.name || null,
          designation: employee.employeeProfile?.designation || null,
          salary: auth.user.role === "ADMIN" ? employee.employeeProfile?.monthlySalary : null,
          assignedLeadsCount: employee._count.assignedLeads,
          recentLeads: employee.assignedLeads,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get employee details error:", error);
    return ApiResponse.serverError("Error retrieving employee profile", error);
  }
}

// PATCH /api/admin/employees/[id]
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.EMPLOYEES_MANAGE,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;
    const body = await req.json();

    const existingEmployee = await prisma.user.findUnique({
      where: { id },
      include: { employeeProfile: true },
    });

    if (!existingEmployee) {
      return ApiResponse.notFound("Employee not found");
    }

    const updateData: any = {};

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) return ApiResponse.badRequest("Name cannot be empty");
      updateData.name = name;
    }

    if (body.email !== undefined) {
      const email = String(body.email).trim().toLowerCase();
      if (!email) return ApiResponse.badRequest("Email cannot be empty");

      if (email !== existingEmployee.email) {
        const conflict = await prisma.user.findUnique({ where: { email } });
        if (conflict) {
          return ApiResponse.badRequest("An account with this email address already exists");
        }
      }
      updateData.email = email;
    }

    if (body.phone !== undefined) {
      updateData.phone = body.phone ? String(body.phone).trim() : null;
    }

    if (body.role !== undefined) {
      if (body.role === "ADMIN" || body.role === "EMPLOYEE" || body.role === "EDITOR") {
        updateData.role = body.role;
      }
    }

    if (body.status !== undefined) {
      if (["ACTIVE", "INACTIVE", "SUSPENDED"].includes(body.status)) {
        // Prevent disabling yourself if you are the current admin
        if (id === auth.user.id && body.status !== "ACTIVE") {
          return ApiResponse.badRequest("You cannot deactivate your own active session");
        }
        updateData.status = body.status;
      }
    }

    if (body.permissions !== undefined) {
      updateData.permissions = sanitizePermissions(body.permissions);
    }

    // Handle department updates if provided
    let departmentId: string | null | undefined = undefined;
    if (body.department !== undefined) {
      const deptName = body.department ? String(body.department).trim() : "";
      if (deptName) {
        const code = deptName.replaceAll(" ", "_").toUpperCase().slice(0, 10);
        const dept = await prisma.department.upsert({
          where: { name: deptName },
          update: {},
          create: { name: deptName, code },
        });
        departmentId = dept.id;
      } else {
        departmentId = null;
      }
    }

    const targetRoleName = (updateData.role || existingEmployee.role) === "ADMIN" ? "ADMIN" : "EMPLOYEE";
    let defaultRole = await prisma.role.findFirst({ where: { name: targetRoleName as any } });
    if (!defaultRole) {
      defaultRole = await prisma.role.create({ data: { name: targetRoleName as any, description: `${targetRoleName} Role` } });
    }

    const empId = existingEmployee.employeeId || `EMP-${Date.now()}`;
    const empCode = empId.replace("-", "");

    // Perform update
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        employeeProfile: {
          upsert: {
            create: {
              employeeId: empId,
              employeeCode: empCode,
              fullName: existingEmployee.name,
              email: existingEmployee.email,
              passwordHash: existingEmployee.password || "N/A",
              roleId: defaultRole.id,
              designation: body.designation !== undefined ? body.designation : null,
              monthlySalary: body.salary !== undefined ? parseFloat(body.salary) : null,
              departmentId: departmentId,
            },
            update: {
              ...(body.designation !== undefined ? { designation: body.designation } : {}),
              ...(body.salary !== undefined ? { monthlySalary: parseFloat(body.salary) } : {}),
              ...(departmentId !== undefined ? { departmentId } : {}),
            },
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

    return NextResponse.json(
      {
        success: true,
        message: "Employee updated successfully",
        employee: {
          id: updated.id,
          employeeId: updated.employeeId,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
          status: updated.status,
          permissions: updated.permissions,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
          designation: updated.employeeProfile?.designation || null,
          department: updated.employeeProfile?.department?.name || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update employee error:", error);
    return ApiResponse.serverError("Error updating employee profile", error);
  }
}

// DELETE /api/admin/employees/[id]
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const auth = await authenticateRequest(req, {
      requiredPermission: PERMISSIONS.EMPLOYEES_MANAGE,
    });

    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = await params;

    if (id === auth.user.id) {
      return ApiResponse.badRequest("You cannot delete your own account");
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return ApiResponse.notFound("Employee not found");
    }

    // Set assigned leads to unassigned (onDelete: SetNull) and remove user
    await prisma.$transaction([
      prisma.lead.updateMany({
        where: { assignedEmployeeId: id },
        data: { assignedEmployeeId: null },
      }),
      prisma.user.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Employee deleted successfully and lead assignments cleared",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete employee error:", error);
    return ApiResponse.serverError("Error deleting employee account", error);
  }
}
