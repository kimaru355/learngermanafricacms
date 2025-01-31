import { PrismaClient } from "@prisma/client";

// Define the singleton function to create a PrismaClient instance
const prismaClientSingleton = (): PrismaClient => {
    return new PrismaClient();
};

// Augment the global namespace to include the `prisma` property
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Check if `prisma` is already defined in the global scope
const globalForPrisma = globalThis as typeof global & {
    prisma: PrismaClient | undefined;
};

// Initialize `prisma` using the singleton pattern
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Export the `prisma` instance
export default prisma;

// In development, attach the `prisma` instance to the global scope
// to avoid creating multiple instances during hot reloads
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
