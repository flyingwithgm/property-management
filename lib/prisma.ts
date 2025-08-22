// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// TypeScript declaration for extended Prisma Client
interface PrismaClientWithAccelerate extends PrismaClient {
  $extends: (...extensions: any[]) => PrismaClientWithAccelerate
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClientWithAccelerate | undefined
}

// Create base Prisma Client
let prisma: PrismaClientWithAccelerate = globalForPrisma.prisma ?? new PrismaClient()

// Extend with Accelerate in production if available
if (process.env.NODE_ENV === 'production' && process.env.ACCELERATE_DATABASE_URL) {
  prisma = prisma.$extends(withAccelerate()) as PrismaClientWithAccelerate
}

// For development, use regular Prisma Client
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }
