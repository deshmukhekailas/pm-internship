-- Initial PostgreSQL Migration for AI-Based Internship Recommendation Engine for PM Internship Scheme
-- Migration: 001_initial_schema.sql

CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID', 'ANY');
CREATE TYPE "EducationLevel" AS ENUM ('TENTH', 'TWELFTH', 'DIPLOMA', 'UNDERGRADUATE', 'POSTGRADUATE', 'DOCTORATE');
CREATE TYPE "SkillCategory" AS ENUM ('TECHNICAL', 'SOFT', 'TOOL', 'DOMAIN');
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
CREATE TYPE "ExperienceType" AS ENUM ('INTERNSHIP', 'APPRENTICESHIP', 'PART_TIME', 'FULL_TIME', 'VOLUNTEER');
CREATE TYPE "InternshipStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');
CREATE TYPE "StipendType" AS ENUM ('MONTHLY', 'FIXED', 'UNPAID');
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'ACCEPTED', 'WITHDRAWN');
CREATE TYPE "EligibilityStatus" AS ENUM ('ELIGIBLE', 'NOT_ELIGIBLE', 'UNKNOWN');
CREATE TYPE "NotificationType" AS ENUM ('RECOMMENDATION', 'APPLICATION', 'DEADLINE', 'PROFILE', 'SYSTEM');

CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "category" TEXT,
    "state" TEXT,
    "district" TEXT,
    "city" TEXT,
    "pinCode" TEXT,
    "bio" TEXT,
    "careerGoal" TEXT,
    "preferredLocations" TEXT NOT NULL DEFAULT '[]',
    "preferredDomains" TEXT NOT NULL DEFAULT '[]',
    "remotePreference" "WorkMode" NOT NULL DEFAULT 'ANY',
    "profileCompletionPercentage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "level" "EducationLevel" NOT NULL,
    "degree" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "institute" TEXT NOT NULL,
    "boardOrUniversity" TEXT,
    "startYear" INTEGER NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "cgpaOrPercentage" DOUBLE PRECISION NOT NULL,
    "maxScale" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "standardizedName" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL DEFAULT 'TECHNICAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "StudentSkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "skillId" TEXT NOT NULL REFERENCES "Skill"("id") ON DELETE CASCADE,
    "proficiencyLevel" "ProficiencyLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("profileId", "skillId")
);

CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "issuingOrganization" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "credentialId" TEXT,
    "credentialUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT NOT NULL,
    "role" TEXT,
    "projectUrl" TEXT,
    "githubUrl" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "experienceType" "ExperienceType" NOT NULL DEFAULT 'INTERNSHIP',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Resume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "parsedData" TEXT NOT NULL DEFAULT '{}',
    "rawText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "logoUrl" TEXT,
    "website" TEXT,
    "industry" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "headquarter" TEXT NOT NULL,
    "isGovernmentPartner" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "contactEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Internship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT,
    "workMode" "WorkMode" NOT NULL DEFAULT 'ONSITE',
    "durationMonths" INTEGER NOT NULL DEFAULT 12,
    "stipendAmount" DOUBLE PRECISION NOT NULL DEFAULT 5000.0,
    "stipendType" "StipendType" NOT NULL DEFAULT 'MONTHLY',
    "openings" INTEGER NOT NULL DEFAULT 10,
    "deadline" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "status" "InternshipStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "InternshipSkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internshipId" TEXT NOT NULL REFERENCES "Internship"("id") ON DELETE CASCADE,
    "skillId" TEXT NOT NULL REFERENCES "Skill"("id") ON DELETE CASCADE,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    UNIQUE ("internshipId", "skillId")
);

CREATE TABLE "EligibilityRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internshipId" TEXT NOT NULL UNIQUE REFERENCES "Internship"("id") ON DELETE CASCADE,
    "minEducationLevel" "EducationLevel" NOT NULL DEFAULT 'UNDERGRADUATE',
    "allowedDegrees" TEXT NOT NULL DEFAULT '[]',
    "allowedBranches" TEXT NOT NULL DEFAULT '[]',
    "minCgpa" DOUBLE PRECISION,
    "maxGraduationYear" INTEGER,
    "minGraduationYear" INTEGER,
    "minAge" INTEGER DEFAULT 21,
    "maxAge" INTEGER DEFAULT 24,
    "allowedStates" TEXT NOT NULL DEFAULT '[]',
    "mandatorySkillNames" TEXT NOT NULL DEFAULT '[]',
    "customRules" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "internshipId" TEXT NOT NULL REFERENCES "Internship"("id") ON DELETE CASCADE,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "coverLetter" TEXT,
    "resumeId" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "notes" TEXT,
    "matchScoreAtApplication" DOUBLE PRECISION,
    UNIQUE ("studentId", "internshipId")
);

CREATE TABLE "SavedInternship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "internshipId" TEXT NOT NULL REFERENCES "Internship"("id") ON DELETE CASCADE,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("studentId", "internshipId")
);

CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "internshipId" TEXT NOT NULL REFERENCES "Internship"("id") ON DELETE CASCADE,
    "compatibilityScore" DOUBLE PRECISION NOT NULL,
    "eligibilityStatus" "EligibilityStatus" NOT NULL DEFAULT 'ELIGIBLE',
    "skillScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "educationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "domainScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "locationScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "experienceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "careerGoalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "preferenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "matchedSkills" TEXT NOT NULL DEFAULT '[]',
    "missingSkills" TEXT NOT NULL DEFAULT '[]',
    "reasons" TEXT NOT NULL DEFAULT '[]',
    "engineMode" TEXT NOT NULL DEFAULT 'LOCAL_ML',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("studentId", "internshipId")
);

CREATE TABLE "RecommendationReason" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recommendationId" TEXT NOT NULL REFERENCES "Recommendation"("id") ON DELETE CASCADE,
    "factor" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "impactScore" DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recommendationId" TEXT NOT NULL REFERENCES "Recommendation"("id") ON DELETE CASCADE,
    "studentId" TEXT NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "isRelevant" BOOLEAN NOT NULL DEFAULT true,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "department" TEXT NOT NULL DEFAULT 'Ministry of Corporate Affairs',
    "employeeId" TEXT NOT NULL UNIQUE,
    "permissions" TEXT NOT NULL DEFAULT '["ALL"]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" TEXT NOT NULL DEFAULT '{}',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "RecommendationConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE DEFAULT 'DEFAULT',
    "skillWeight" DOUBLE PRECISION NOT NULL DEFAULT 30.0,
    "educationWeight" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "domainWeight" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
    "locationWeight" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "experienceWeight" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "careerGoalWeight" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "preferenceWeight" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "minScoreThreshold" DOUBLE PRECISION NOT NULL DEFAULT 40.0,
    "aiProvider" TEXT NOT NULL DEFAULT 'LOCAL_ML',
    "strictEligibility" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_user_email" ON "User"("email");
CREATE INDEX "idx_user_role" ON "User"("role");
CREATE INDEX "idx_student_user" ON "StudentProfile"("userId");
CREATE INDEX "idx_internship_org" ON "Internship"("organizationId");
CREATE INDEX "idx_internship_domain" ON "Internship"("domain");
CREATE INDEX "idx_internship_workmode" ON "Internship"("workMode");
CREATE INDEX "idx_recommendation_student" ON "Recommendation"("studentId");
CREATE INDEX "idx_recommendation_score" ON "Recommendation"("compatibilityScore");
CREATE INDEX "idx_application_student" ON "Application"("studentId");
CREATE INDEX "idx_notification_user" ON "Notification"("userId");
