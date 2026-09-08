import { prisma } from "@/lib/prisma";

export async function createLead(data: {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  service?: string;
  message: string;
  source?: string;
  pageUrl?: string;
  portfolio?: string;
  phone?: string;
  assignedEmployeeId?: string | null;
}) {
  return prisma.lead.create({
    data: {
      ...data,
      status: "NEW",
    },
    include: {
      assignedEmployee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
          email: true,
        },
      },
    },
  });
}

export interface GetLeadsOptions {
  status?: string;
  assignedEmployeeId?: string | null;
  search?: string;
  take?: number;
  skip?: number;
  isArchived?: boolean;
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

export async function getLeads(options: GetLeadsOptions = {}) {
  const where: any = {
    isArchived: options.isArchived ?? false,
  };

  if (options.status) {
    where.status = options.status;
  }

  if (options.assignedEmployeeId !== undefined) {
    where.assignedEmployeeId = options.assignedEmployeeId;
  }

  if (options.priority) {
    where.priority = options.priority;
  }

  if (options.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { email: { contains: options.search, mode: "insensitive" } },
      { company: { contains: options.search, mode: "insensitive" } },
      { phone: { contains: options.search, mode: "insensitive" } },
    ];
  }

  return prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: options.take,
    skip: options.skip,
    include: {
      assignedEmployee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
          email: true,
          role: true,
        },
      },
      chatSession: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedEmployee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
          email: true,
          role: true,
        },
      },
      internalNotes: {
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
            }
          }
        }
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
            }
          }
        }
      }
    },
  });
}

export async function updateLead(
  id: string,
  data: {
    status?: any;
    assignedEmployeeId?: string | null;
    budget?: string;
    company?: string;
    service?: string;
    phone?: string;
    notes?: string | null;
    followUpAt?: Date | null;
    message?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    isArchived?: boolean;
  }
) {
  return prisma.lead.update({
    where: { id },
    data,
    include: {
      assignedEmployee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function assignLead(leadId: string, employeeId: string | null) {
  return prisma.lead.update({
    where: { id: leadId },
    data: {
      assignedEmployeeId: employeeId,
    },
    include: {
      assignedEmployee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function deleteLead(id: string) {
  return prisma.lead.delete({
    where: { id },
  });
}

export async function logLeadActivity(data: {
  leadId: string;
  action: string;
  details?: string;
  employeeId?: string | null;
}) {
  return prisma.leadActivity.create({
    data,
  });
}

export async function addLeadNote(data: {
  leadId: string;
  content: string;
  employeeId: string;
}) {
  return prisma.leadNote.create({
    data,
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
        }
      }
    }
  });
}

export async function getLeadNotes(leadId: string) {
  return prisma.leadNote.findMany({
    where: { leadId },
    orderBy: { createdAt: 'desc' },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
        }
      }
    }
  });
}

export async function getLeadActivities(leadId: string) {
  return prisma.leadActivity.findMany({
    where: { leadId },
    orderBy: { createdAt: 'desc' },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          employeeId: true,
        }
      }
    }
  });
}
