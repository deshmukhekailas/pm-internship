import { PrismaClient } from '@prisma/client';
import { config } from './env';

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

const clientOptions = {
  datasources: {
    db: {
      url: config.databaseUrl,
    },
  },
  log: ['error' as const, 'warn' as const],
};

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(clientOptions);
} else {
  // In development, create or recreate client with current database URL
  if (!global.__prismaClient) {
    global.__prismaClient = new PrismaClient(clientOptions);
  }
  prisma = global.__prismaClient;
}

export { prisma };
export default prisma;
