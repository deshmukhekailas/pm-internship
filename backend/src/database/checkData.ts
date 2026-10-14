import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const studentCount = await prisma.studentProfile.count();
  const adminCount = await prisma.admin.count();
  const orgCount = await prisma.organization.count();
  const internshipCount = await prisma.internship.count();
  const skillCount = await prisma.skill.count();
  const appCount = await prisma.application.count();

  console.log('📊 Current Database State:');
  console.log(`  Users: ${userCount}`);
  console.log(`  Student Profiles: ${studentCount}`);
  console.log(`  Admins: ${adminCount}`);
  console.log(`  Organizations: ${orgCount}`);
  console.log(`  Internships: ${internshipCount}`);
  console.log(`  Skills: ${skillCount}`);
  console.log(`  Applications: ${appCount}`);
}

main()
  .catch((e) => {
    console.error('Error checking DB:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
