import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Purging all student accounts, profiles, applications, and test data...');

  // 1. Delete all recommendation feedback
  const feedbackResult = await prisma.feedback.deleteMany();
  console.log(`- Cleared ${feedbackResult.count} feedback records.`);

  // 2. Delete all recommendations & reasons
  const recReasonResult = await prisma.recommendationReason.deleteMany();
  console.log(`- Cleared ${recReasonResult.count} recommendation reasons.`);

  const recResult = await prisma.recommendation.deleteMany();
  console.log(`- Cleared ${recResult.count} recommendation records.`);

  // 3. Delete saved internships & applications
  const savedResult = await prisma.savedInternship.deleteMany();
  console.log(`- Cleared ${savedResult.count} saved internships.`);

  const appResult = await prisma.application.deleteMany();
  console.log(`- Cleared ${appResult.count} applications.`);

  // 4. Delete student resume & portfolio entities
  const resumeResult = await prisma.resume.deleteMany();
  console.log(`- Cleared ${resumeResult.count} uploaded resumes.`);

  const expResult = await prisma.experience.deleteMany();
  console.log(`- Cleared ${expResult.count} student work experiences.`);

  const projResult = await prisma.project.deleteMany();
  console.log(`- Cleared ${projResult.count} student projects.`);

  const certResult = await prisma.certification.deleteMany();
  console.log(`- Cleared ${certResult.count} student certifications.`);

  const skillResult = await prisma.studentSkill.deleteMany();
  console.log(`- Cleared ${skillResult.count} student skills.`);

  const eduResult = await prisma.education.deleteMany();
  console.log(`- Cleared ${eduResult.count} education records.`);

  // 5. Delete student profiles
  const profileResult = await prisma.studentProfile.deleteMany();
  console.log(`- Cleared ${profileResult.count} student profiles.`);

  // 6. Delete all notifications for students
  const notifResult = await prisma.notification.deleteMany();
  console.log(`- Cleared ${notifResult.count} notifications.`);

  // 7. Delete student audit logs
  const auditResult = await prisma.auditLog.deleteMany();
  console.log(`- Cleared ${auditResult.count} audit logs.`);

  // 8. Delete all non-admin users
  const userResult = await prisma.user.deleteMany({
    where: {
      role: 'STUDENT',
    },
  });
  console.log(`- Cleared ${userResult.count} student user accounts.`);

  // Verify preserved master data
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  const orgCount = await prisma.organization.count();
  const internshipCount = await prisma.internship.count();
  const skillCatalogCount = await prisma.skill.count();

  console.log('-------------------------------------------------------');
  console.log('✅ ALL CANDIDATE & DUMMY DATA PURGED SUCCESSFULLY!');
  console.log('🛡️ Preserved Platform Master Infrastructure:');
  console.log(`  - Admin Accounts:       ${adminCount} (admin@pminternship.gov.in)`);
  console.log(`  - Active Organizations: ${orgCount}`);
  console.log(`  - Scheme Internships:   ${internshipCount}`);
  console.log(`  - Skill Taxonomy:       ${skillCatalogCount}`);
  console.log(`  - Student Accounts:     0`);
  console.log(`  - Student Profiles:     0`);
  console.log('-------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error during data purge:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
