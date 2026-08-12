import { prisma } from "@/lib/prisma";

export async function createPromptTemplate(name: string, category: string, prompt: string) {
    return prisma.aiPromptTemplate.create({
        data: { name, category, prompt }
    });
}

export async function getPromptTemplates(category?: string) {
    return prisma.aiPromptTemplate.findMany({
        where: category ? { category } : undefined
    });
}

export async function logAiUsage(userId: string, action: string, tokens: number, prompt: string, response: string) {
    return prisma.aiUsageHistory.create({
        data: { userId, action, tokens, prompt, response }
    });
}

export async function generateContent(prompt: string, provider: 'openai' | 'gemini' = 'openai') {
    // Mock integration for Phase 4 structural setup.
    // In production, this would call the respective API clients.
    const mockResponse = `Generated response for: ${prompt.substring(0, 20)}...`;
    const tokensUsed = prompt.length + 50;

    return { response: mockResponse, tokens: tokensUsed };
}
