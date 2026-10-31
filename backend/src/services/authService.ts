import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { AuditService } from './auditService';
import { OtpService } from './otpService';
import { GoogleAuthService } from './googleAuthService';

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

    if (!user.passwordHash) {
      throw new Error('This account was created with Google or OTP. Please sign in using Google or OTP, or set a password.');
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
        avatarUrl: user.avatarUrl,
        studentProfileId: user.studentProfile?.id,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login using verified Email OTP
   */
  public static async loginWithOtp(email: string, otp: string) {
    const cleanEmail = email.toLowerCase().trim();

    // Verify OTP first
    await OtpService.verifyOtp(cleanEmail, otp, 'LOGIN');

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        studentProfile: true,
        admin: true,
      },
    });

    if (!user || !user.isActive) {
      throw new Error('No active account found for this email.');
    }

    // Mark email verified
    if (!user.isEmailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });
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
      action: 'LOGIN_OTP',
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
        avatarUrl: user.avatarUrl,
        studentProfileId: user.studentProfile?.id,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Register using verified Email OTP
   */
  public static async registerWithOtp(data: {
    email: string;
    otp: string;
    firstName: string;
    lastName: string;
    phone?: string;
    password: string;
  }) {
    const cleanEmail = data.email.toLowerCase().trim();

    if (!data.password || data.password.length < 8) {
      throw new Error('Password is compulsory and must be at least 8 characters long.');
    }

    // Verify OTP first
    await OtpService.verifyOtp(cleanEmail, data.otp, 'SIGNUP');

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone?.trim() || null,
        isEmailVerified: true,
        authProvider: 'OTP',
        role: 'STUDENT',
        studentProfile: {
          create: {
            profileCompletionPercentage: 25,
          },
        },
      },
      include: {
        studentProfile: true,
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
      action: 'REGISTER_OTP',
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
        avatarUrl: user.avatarUrl,
        studentProfileId: user.studentProfile?.id,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login or Register via Google Account
   */
  public static async loginOrRegisterWithGoogle(credential: string) {
    const googleProfile = await GoogleAuthService.verifyGoogleToken(credential);
    const cleanEmail = googleProfile.email.toLowerCase().trim();

    // Check if user exists by email or googleId
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { googleId: googleProfile.googleId },
        ],
      },
      include: {
        studentProfile: true,
        admin: true,
      },
    });

    let isNewUser = false;

    if (!user) {
      // Auto-register candidate with Google Profile
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          googleId: googleProfile.googleId,
          avatarUrl: googleProfile.avatarUrl || null,
          isEmailVerified: true,
          authProvider: 'GOOGLE',
          role: 'STUDENT',
          firstName: googleProfile.firstName || 'Candidate',
          lastName: googleProfile.lastName || 'Student',
          studentProfile: {
            create: {
              profileCompletionPercentage: 30,
            },
          },
        },
        include: {
          studentProfile: true,
          admin: true,
        },
      });
    } else {
      // Update googleId, avatarUrl, isEmailVerified if not present
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId || googleProfile.googleId,
          avatarUrl: user.avatarUrl || googleProfile.avatarUrl || null,
          isEmailVerified: true,
        },
        include: {
          studentProfile: true,
          admin: true,
        },
      });
    }

    if (!user.isActive) {
      throw new Error('This account has been deactivated. Please contact support.');
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
      action: isNewUser ? 'REGISTER_GOOGLE' : 'LOGIN_GOOGLE',
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
        avatarUrl: user.avatarUrl,
        studentProfileId: user.studentProfile?.id,
      },
      accessToken,
      refreshToken,
      isNewUser,
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
