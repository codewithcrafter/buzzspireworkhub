import { prisma } from "@/lib/prisma";

export async function updateProjectVisibility(
    projectId: string,
    visibility: {
        showTimeline?: boolean;
        showFiles?: boolean;
        showInvoices?: boolean;
        showPayments?: boolean;
        showProgress?: boolean;
        showMessages?: boolean;
        showTickets?: boolean;
        showDownloads?: boolean;
        showDeliverables?: boolean;
    }
) {
    return prisma.project.update({
        where: { id: projectId },
        data: visibility,
    });
}

export async function updateProjectProgress(
    projectId: string,
    progress: number,
    progressStages: any
) {
    return prisma.project.update({
        where: { id: projectId },
        data: {
            progress,
            progressStages,
        },
    });
}

export async function addProjectUpdate(
    projectId: string,
    title: string,
    description: string
) {
    return prisma.projectUpdate.create({
        data: {
            projectId,
            title,
            description,
        },
    });
}

export async function addProjectFile(
    projectId: string,
    name: string,
    url: string,
    size: number,
    category: string,
    clientVisible: boolean = true
) {
    return prisma.projectFile.create({
        data: {
            projectId,
            name,
            url,
            size,
            category,
            clientVisible,
        },
    });
}

export async function sendProjectMessage(
    projectId: string,
    senderId: string,
    recipientId: string,
    text: string
) {
    return prisma.projectMessage.create({
        data: {
            projectId,
            senderId,
            recipientId,
            text,
        },
    });
}

export async function getClientProjects(clientId: string) {
    return prisma.project.findMany({
        where: { clientId },
        orderBy: { updatedAt: "desc" },
    });
}

// Securely retrieve project details for a client, checking visibility flags
export async function getClientProjectDetails(projectId: string, clientId: string) {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            clientId,
        },
    });

    if (!project) {
        throw new Error("Project not found or access denied");
    }

    // Load related items conditionally based on visibility toggles
    const [updates, files, messages] = await Promise.all([
        project.showTimeline
            ? prisma.projectUpdate.findMany({
                  where: { projectId },
                  orderBy: { createdAt: "desc" },
              })
            : Promise.resolve([]),

        project.showFiles
            ? prisma.projectFile.findMany({
                  where: {
                      projectId,
                      clientVisible: true,
                  },
                  orderBy: { createdAt: "desc" },
              })
            : Promise.resolve([]),

        project.showMessages
            ? prisma.projectMessage.findMany({
                  where: { projectId },
                  orderBy: { createdAt: "asc" },
              })
            : Promise.resolve([]),
    ]);

    return {
        ...project,
        updates,
        files,
        messages,
    };
}

// ADMIN METHODS

export async function getAdminProjects() {
    return prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        include: { client: true },
    });
}

export async function getAdminProjectDetails(projectId: string) {
    return prisma.project.findUnique({
        where: { id: projectId },
        include: {
            client: true,
            updates: { orderBy: { createdAt: "desc" } },
            files: { orderBy: { createdAt: "desc" } },
            messages: { orderBy: { createdAt: "asc" } },
            invoices: true,
        },
    });
}

export async function createProject(data: any) {
    return prisma.project.create({
        data,
    });
}

export async function deleteProject(projectId: string) {
    return prisma.project.delete({
        where: { id: projectId },
    });
}

