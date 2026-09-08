import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    const [
        clientsCount,
        leadsCount,
        projectsCount,
        paidInvoices,
        recentLeads,
        recentClientsRaw,
        activities,
        tasks
    ] = await Promise.all([
        prisma.user.count({ where: { role: "CLIENT" } }),
        prisma.lead.count(),
        prisma.project.count(),
        prisma.invoice.aggregate({
            where: { status: "PAID" },
            _sum: { amount: true }
        }),
        prisma.lead.findMany({
            take: 5,
            orderBy: { createdAt: "desc" }
        }),
        prisma.user.findMany({
            where: { role: "CLIENT" },
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { invoices: { where: { status: "PAID" } } }
        }),
        prisma.activityLog.findMany({
            take: 10,
            orderBy: { createdAt: "desc" }
        }),
        prisma.adminTask.findMany({
            orderBy: { createdAt: "desc" }
        })
    ]);

    const revenue = paidInvoices._sum.amount || 0;

    const recentClients = recentClientsRaw.map(client => {
        const clientRevenue = client.invoices.reduce((sum, inv) => sum + inv.amount, 0);
        return {
            id: client.id,
            name: client.name,
            company: client.company || "N/A",
            status: "active", // can make dynamic later
            revenue: `₹${clientRevenue.toLocaleString("en-IN")}`,
            joined: new Date(client.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
    });

    const formattedLeads = recentLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        company: lead.company || "N/A",
        value: lead.budget || "₹0",
        status: lead.status.toLowerCase(),
        time: new Date(lead.createdAt).toLocaleDateString()
    }));

    const formattedActivities = activities.map(act => ({
        id: act.id,
        user: act.user,
        avatar: act.avatar,
        action: act.action,
        target: act.target,
        time: new Date(act.createdAt).toLocaleDateString(),
        type: act.type
    }));

    const formattedTasks = tasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
        dueDate: task.dueDate || "No Date",
        priority: task.priority as "high" | "medium" | "low"
    }));

    return {
        clients: clientsCount,
        leads: leadsCount,
        projects: projectsCount,
        revenue,
        recentLeads: formattedLeads,
        recentClients,
        activities: formattedActivities,
        tasks: formattedTasks
    };
}
