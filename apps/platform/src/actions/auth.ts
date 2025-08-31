'use server';

import { prisma } from "@/lib/prisma";

export async function createUser({ clerkId, email }: {
  clerkId: string;
  email: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (existingUser) return { success: true, user: existingUser };

    const newUser = await prisma.user.create({
      data: { clerkId, email },
    });

    return { success: true, user: newUser };
    
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}