import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { AuditService } from './auditService';

export class AuthService {
  public static async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'STUDENT' | 'ADMIN';
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await hashPassword(data.password);
    const role = data.role || 'STUDENT';

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: role as any,
        // Automatically create student profile or admin profile
        ...(role === 'STUDENT'
          ? {
              studentProfile: {
                create: {
                  profileCompletionPercentage: 25,
                },
              },
            }
          : {
              admin: {
                create: {
                  employeeId: `GOV-${Math.floor(100000 + Math.random() * 900000)}`,
                  department: 'Ministry of Corporate Affairs',
                },
              },
            }),
      },
      include: {
        studentProfile: true,
        admin: true,
      },
    });

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      studentProfileId: user.studentProfile?.id,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await AuditService.log({
      userId: user.id,
      action: 'REGISTER',
      resource: 'User',
      resourceId: user.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        studentProfileId: user.studentProfile?.id,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        studentProfile: true,
        admin: true,
      },
    });

    if (!user || !user.isActive) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      studentProfileId: user.studentProfile?.id,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await AuditService.log({
      userId: user.id,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        studentProfileId: user.studentProfile?.id,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async refreshToken(token: string) {
    try {
      const payload = verifyRefreshToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: { studentProfile: true },
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid user or account deactivated.');
      }

      const newPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        studentProfileId: user.studentProfile?.id,
      };

      const accessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(newPayload);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new Error('Invalid or expired refresh token.');
    }
  }

  public static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true,
        studentProfile: {
          include: {
            educations: true,
            studentSkills: {
              include: { skill: true },
            },
            projects: true,
            experiences: true,
            certifications: true,
            resumes: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
        admin: true,
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  }
}
