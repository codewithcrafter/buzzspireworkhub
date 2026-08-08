import { prisma } from "@/lib/prisma";

export async function createWorkflow(name: string, trigger: string, conditions?: any) {
    return prisma.automationWorkflow.create({
        data: { name, trigger, conditions }
    });
}

export async function getActiveWorkflows() {
    return prisma.automationWorkflow.findMany({
        where: { isActive: true },
        include: { actions: true }
    });
}

export async function addWorkflowAction(workflowId: string, type: string, config: any) {
    return prisma.workflowAction.create({
        data: { workflowId, type, config }
    });
}

export async function triggerWorkflowEvent(triggerName: string, payload: any) {
    // Engine mock for triggering active workflows based on events like 'LEAD_RECEIVED'
    const activeWorkflows = await prisma.automationWorkflow.findMany({
        where: { trigger: triggerName, isActive: true },
        include: { actions: true }
    });

    // In a real system, we would iterate and execute jobs via a queue (e.g. BullMQ)
    return { executed: activeWorkflows.length, payload };
}
