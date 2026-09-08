import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendInvitationEmail, sendClientWelcomeEmail } from "./email.service";

export async function createClient(
    name: string,
    email: string,
    password: string
) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "CLIENT",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;
}

export async function inviteClient(
    name: string,
    email: string,
    company: string,
    phone: string
) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        throw new Error("Email already registered in the system");
    }

    // Generate secure invitation token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Invitation expires in 24 hours
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);

    // Save client user with role CLIENT, optional password, company details and token info
    const user = await prisma.user.create({
        data: {
            name,
            email: normalizedEmail,
            company,
            phone,
            role: "CLIENT",
            invitationToken: token,
            invitationExpires: expiry,
        },
        select: {
            id: true,
            name: true,
            email: true,
            company: true,
            phone: true,
            role: true,
            invitationToken: true,
            createdAt: true,
        },
    });

    // Send invitation email asynchronously/synchronously
    let emailSent = true;
    try {
        await sendInvitationEmail(user.email, user.name, token);
    } catch (emailError) {
        console.error("Failed to send invitation email:", emailError);
        emailSent = false;
        // We still keep the database record, since the admin can retrieve it or retry.
    }

    return { user, emailSent };
}

export async function createClientWithPassword(
    name: string,
    email: string,
    password: string,
    company: string,
    phone: string,
    service: string,
    totalBudget: number = 0,
    initialPaidAmount: number = 0,
    projectName: string = "",
    projectStartDate: string = "",
    expectedCompletionDate: string = "",
    projectStatus: any = "PLANNING",
    completionPercentage: number = 0
) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        throw new Error("Email already registered in the system");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            company,
            phone,
            role: "CLIENT",
            status: "ACTIVE", // Set them active directly
            contractAmount: totalBudget,
        },
        select: {
            id: true,
            name: true,
            email: true,
            company: true,
            phone: true,
            role: true,
            createdAt: true,
        },
    });

    const pName = projectName || `${company || name} - ${service || "Project"}`;
    const pDesc = [
        projectStartDate ? `Start Date: ${projectStartDate}` : "",
        expectedCompletionDate ? `Expected Completion: ${expectedCompletionDate}` : ""
    ].filter(Boolean).join("\n");

    const project = await prisma.project.create({
        data: {
            title: pName,
            description: pDesc || null,
            status: projectStatus,
            progress: completionPercentage,
            clientId: user.id,
        }
    });

    if (initialPaidAmount > 0) {
        await prisma.clientPayment.create({
            data: {
                clientId: user.id,
                amount: initialPaidAmount,
                description: "Initial Payment",
                method: "Bank Transfer", // Default or you can make it a parameter
            }
        });
    }

    let emailSent = true;
    let emailErrorMsg = null;
    try {
        await sendClientWelcomeEmail(user.email, user.name, password, service);
    } catch (emailError: any) {
        console.error("Failed to send welcome email:", emailError);
        emailSent = false;
        emailErrorMsg = emailError.message || String(emailError);
    }

    return { user, emailSent, emailError: emailErrorMsg };
}

export async function acceptInvitation(token: string, password: string) {
    if (!token || !password) {
        throw new Error("Token and password are required");
    }

    // Find user with active token
    const user = await prisma.user.findUnique({
        where: {
            invitationToken: token,
        },
    });

    if (!user) {
        throw new Error("Invalid or expired invitation link");
    }

    // Verify token expiration
    if (user.invitationExpires && new Date() > user.invitationExpires) {
        throw new Error("Invitation link has expired (24h limit reached)");
    }

    // Hash the client's new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user: set password, invalidate invitation details
    const updatedUser = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: hashedPassword,
            invitationToken: null,
            invitationExpires: null,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            updatedAt: true,
        },
    });

    return updatedUser;
}
