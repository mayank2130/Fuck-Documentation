import { PrismaClient } from '@/generated/prisma';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function generateApiKey(clerkId: string, name?: string): Promise<string> {
  // Generate random API key
  const randomKey = crypto.randomBytes(32).toString('hex');
  const apiKey = `df_${randomKey}`;

  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId
    }
  });
  if (!dbUser) {
    throw new Error('User not found');
  }
  // Store in database
  await prisma.apiKey.create({
    data: {
      key: apiKey,
      name: name || 'Generated Key',
      userId: dbUser.id
    }
  });

  return apiKey;
}