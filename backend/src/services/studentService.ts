import prisma from '../config/db';
import { ResumeParserService } from './resumeParserService';

export class StudentService {
  /**
   * Recalculate profile completion percentage
   */
  public static calculateCompletion(profile: any): number {
    let score = 0;
    // 1. Personal details
    if (profile.dateOfBirth && profile.gender && profile.state) score += 20;
    else if (profile.state) score += 10;

    // 2. Career goals & preferences
    if (profile.careerGoal && profile.preferredDomains && profile.preferredDomains !== '[]') score += 15;
    else if (profile.careerGoal || profile.preferredDomains !== '[]') score += 10;

    // 3. Education
    if (profile.educations && profile.educations.length > 0) score += 25;

    // 4. Skills
    if (profile.studentSkills && profile.studentSkills.length >= 3) score += 20;
    else if (profile.studentSkills && profile.studentSkills.length > 0) score += 10;

    // 5. Projects / Experience / Resume
    const hasProjects = profile.projects && profile.projects.length > 0;
    const hasResume = profile.resumes && profile.resumes.length > 0;
    if (hasProjects && hasResume) score += 20;
    else if (hasProjects || hasResume) score += 10;

    return Math.min(100, score);
  }

  public static async getProfile(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        educations: {
          orderBy: { graduationYear: 'desc' },
        },
        studentSkills: {
          include: { skill: true },
        },
        projects: {
          orderBy: { createdAt: 'desc' },
        },
        experiences: {
          orderBy: { startDate: 'desc' },
        },
        certifications: true,
        resumes: {
          orderBy: { createdAt: 'desc' },
        },
        savedInternships: {
          include: {
            internship: {
              include: {
                organization: true,
              },
            },
          },
        },
        applications: {
          include: {
            internship: {
              include: {
                organization: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      throw new Error('Student profile not found.');
    }

    return profile;
  }

  public static async updateProfile(userId: string, data: any) {
    const current = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        educations: true,
        studentSkills: true,
        projects: true,
        resumes: true,
      },
    });

    if (!current) {
      throw new Error('Student profile not found.');
    }

    const preferredLocations = data.preferredLocations
      ? JSON.stringify(data.preferredLocations)
      : current.preferredLocations;

    const preferredDomains = data.preferredDomains
      ? JSON.stringify(data.preferredDomains)
      : current.preferredDomains;

    const updated = await prisma.studentProfile.update({
      where: { userId },
      data: {
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : current.dateOfBirth,
        gender: data.gender !== undefined ? data.gender : current.gender,
        category: data.category !== undefined ? data.category : current.category,
        state: data.state !== undefined ? data.state : current.state,
        district: data.district !== undefined ? data.district : current.district,
        city: data.city !== undefined ? data.city : current.city,
        pinCode: data.pinCode !== undefined ? data.pinCode : current.pinCode,
        bio: data.bio !== undefined ? data.bio : current.bio,
        careerGoal: data.careerGoal !== undefined ? data.careerGoal : current.careerGoal,
        preferredLocations,
        preferredDomains,
        remotePreference: data.remotePreference || current.remotePreference,
      },
      include: {
        educations: true,
        studentSkills: true,
        projects: true,
        resumes: true,
      },
    });

    const completion = this.calculateCompletion(updated);
    return prisma.studentProfile.update({
      where: { userId },
      data: { profileCompletionPercentage: completion },
      include: {
        user: true,
        educations: true,
        studentSkills: { include: { skill: true } },
      },
    });
  }

  public static async addEducation(userId: string, data: any) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        level: data.level,
        degree: data.degree,
        branch: data.branch,
        institute: data.institute,
        boardOrUniversity: data.boardOrUniversity,
        startYear: data.startYear,
        graduationYear: data.graduationYear,
        cgpaOrPercentage: data.cgpaOrPercentage,
        maxScale: data.maxScale || 10.0,
        isCompleted: data.isCompleted || false,
      },
    });

    // Refresh completion
    await this.refreshCompletion(profile.id);
    return education;
  }

  public static async deleteEducation(userId: string, educationId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    await prisma.education.delete({
      where: { id: educationId },
    });

    await this.refreshCompletion(profile.id);
    return { success: true };
  }

  public static async addSkill(userId: string, data: { skillName: string; category?: string; proficiencyLevel?: string }) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    const name = data.skillName.trim();
    const standardizedName = name.toLowerCase();

    // Find or create skill in global catalog
    let skill = await prisma.skill.findUnique({
      where: { name },
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: {
          name,
          standardizedName,
          category: (data.category as any) || 'TECHNICAL',
        },
      });
    }

    // Link skill to student
    const studentSkill = await prisma.studentSkill.upsert({
      where: {
        profileId_skillId: {
          profileId: profile.id,
          skillId: skill.id,
        },
      },
      update: {
        proficiencyLevel: (data.proficiencyLevel as any) || 'INTERMEDIATE',
      },
      create: {
        profileId: profile.id,
        skillId: skill.id,
        proficiencyLevel: (data.proficiencyLevel as any) || 'INTERMEDIATE',
      },
      include: {
        skill: true,
      },
    });

    await this.refreshCompletion(profile.id);
    return studentSkill;
  }

  public static async deleteSkill(userId: string, studentSkillId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    await prisma.studentSkill.delete({
      where: { id: studentSkillId },
    });

    await this.refreshCompletion(profile.id);
    return { success: true };
  }

  public static async addProject(userId: string, data: any) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    const project = await prisma.project.create({
      data: {
        profileId: profile.id,
        title: data.title,
        description: data.description,
        technologies: data.technologies,
        role: data.role,
        projectUrl: data.projectUrl,
        githubUrl: data.githubUrl,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    await this.refreshCompletion(profile.id);
    return project;
  }

  public static async deleteProject(userId: string, projectId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    await prisma.project.delete({
      where: { id: projectId },
    });

    await this.refreshCompletion(profile.id);
    return { success: true };
  }

  public static async processResumeUpload(userId: string, file: Express.Multer.File) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    // Parse resume
    const parsedData = await ResumeParserService.parseResume(file.path, file.mimetype);

    // Save Resume entity in database
    const resume = await prisma.resume.create({
      data: {
        profileId: profile.id,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype || 'application/pdf',
        parsedData: JSON.stringify(parsedData),
        rawText: parsedData.rawTextPreview,
        status: 'PARSED',
      },
    });

    return {
      resumeId: resume.id,
      fileName: resume.fileName,
      parsedData,
    };
  }

  public static async applyResumeDataToProfile(userId: string, resumeId: string, confirmedData: any) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new Error('Student profile not found.');

    // 1. Apply skills
    if (confirmedData.skills && Array.isArray(confirmedData.skills)) {
      for (const skillName of confirmedData.skills) {
        if (typeof skillName === 'string' && skillName.trim()) {
          await this.addSkill(userId, { skillName: skillName.trim() });
        }
      }
    }

    // 2. Apply education
    if (confirmedData.education && Array.isArray(confirmedData.education)) {
      for (const edu of confirmedData.education) {
        if (edu.degree && edu.branch) {
          await prisma.education.create({
            data: {
              profileId: profile.id,
              level: 'UNDERGRADUATE',
              degree: edu.degree,
              branch: edu.branch,
              institute: edu.institute || 'University Institute',
              graduationYear: edu.graduationYear || 2026,
              startYear: (edu.graduationYear || 2026) - 4,
              cgpaOrPercentage: edu.cgpaOrPercentage || 8.0,
            },
          });
        }
      }
    }

    // 3. Apply projects
    if (confirmedData.projects && Array.isArray(confirmedData.projects)) {
      for (const proj of confirmedData.projects) {
        if (proj.title && proj.description) {
          await prisma.project.create({
            data: {
              profileId: profile.id,
              title: proj.title,
              description: proj.description,
              technologies: proj.technologies || 'General',
            },
          });
        }
      }
    }

    // Update resume status to CONFIRMED
    await prisma.resume.update({
      where: { id: resumeId },
      data: { status: 'CONFIRMED' },
    });

    await this.refreshCompletion(profile.id);
    return this.getProfile(userId);
  }

  private static async refreshCompletion(profileId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { id: profileId },
      include: {
        educations: true,
        studentSkills: true,
        projects: true,
        resumes: true,
      },
    });
    if (profile) {
      const completion = this.calculateCompletion(profile);
      await prisma.studentProfile.update({
        where: { id: profileId },
        data: { profileCompletionPercentage: completion },
      });
    }
  }
}
