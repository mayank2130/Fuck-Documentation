import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function validateApiKey(apiKey: string): Promise<{
  isValid: boolean;
  userId?: string;
  apiKeyId?: string;
}> {
  try {
    const record = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true }
    });

    if (record) {
      return {
        isValid: true,
        userId: record.userId,
        apiKeyId: record.id
      };
    }

    return { isValid: false };
  } catch (error) {
    console.error('API key validation error:', error);
    return { isValid: false };
  }
}