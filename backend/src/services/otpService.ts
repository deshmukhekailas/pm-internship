import prisma from '../config/db';
import { MailService } from './mailService';

export class OtpService {
  /**
   * Generate and send 6-digit OTP
   */
  public static async generateAndSendOtp(email: string, type: 'SIGNUP' | 'LOGIN'): Promise<{ success: boolean; message: string; devOtp?: string; isDevMode?: boolean }> {
    const cleanEmail = email.toLowerCase().trim();

    // Check rate limit: 60-second cooldown
    const recentOtp = await prisma.otpVerification.findFirst({
      where: {
        email: cleanEmail,
        type,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000), // Created within last 60s
        },
      },
    });

    if (recentOtp) {
      throw new Error('Please wait 60 seconds before requesting another verification code.');
    }

    // For LOGIN type, verify user actually exists
    if (type === 'LOGIN') {
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (!user) {
        throw new Error('No registered account found with this email. Please sign up first.');
      }
      if (!user.isActive) {
        throw new Error('This account has been deactivated. Please contact support.');
      }
    }

    // For SIGNUP type, verify email is not already taken
    if (type === 'SIGNUP') {
      const existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingUser) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }
    }

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Invalidate previous unverified OTPs for this email & type
    await prisma.otpVerification.deleteMany({
      where: {
        email: cleanEmail,
        type,
        verified: false,
      },
    });

    // Save in database
    await prisma.otpVerification.create({
      data: {
        email: cleanEmail,
        otp,
        type,
        expiresAt,
        verified: false,
      },
    });

    // Send email via mail service
    const mailResult = await MailService.sendOtpEmail(cleanEmail, otp, type);

    const message = mailResult.devMode
      ? `Verification code generated! (Dev mode: SMTP not configured. Check the code on screen or in backend terminal).`
      : `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox and spam folder.`;

    return {
      success: true,
      message,
      devOtp: mailResult.devMode ? otp : undefined,
      isDevMode: mailResult.devMode,
    };
  }

  /**
   * Verify entered OTP
   */
  public static async verifyOtp(email: string, otp: string, type: 'SIGNUP' | 'LOGIN'): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.trim();

    const record = await prisma.otpVerification.findFirst({
      where: {
        email: cleanEmail,
        otp: cleanOtp,
        type,
        verified: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!record) {
      // Check if there was an expired record
      const expiredRecord = await prisma.otpVerification.findFirst({
        where: {
          email: cleanEmail,
          otp: cleanOtp,
          type,
          verified: false,
        },
      });

      if (expiredRecord && expiredRecord.expiresAt <= new Date()) {
        throw new Error('Verification code has expired. Please request a new one.');
      }

      throw new Error('Invalid verification code. Please check the 6-digit code sent to your email.');
    }

    // Mark verified
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return true;
  }
}
