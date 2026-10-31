import { describe, it, expect, afterAll } from 'vitest';
import { OtpService } from '../services/otpService';
import { AuthService } from '../services/authService';
import { GoogleAuthService } from '../services/googleAuthService';
import prisma from '../config/db';

describe('OTP & Google Authentication', () => {
  const testEmail = `vitest_${Date.now()}@example.com`;
  let generatedOtp: string = '';

  it('should generate an OTP for signup and return devOtp in test mode', async () => {
    const res = await OtpService.generateAndSendOtp(testEmail, 'SIGNUP');
    expect(res.success).toBe(true);
    expect(res.devOtp).toBeDefined();
    expect(res.devOtp?.length).toBe(6);
    generatedOtp = res.devOtp!;
  });

  it('should register a candidate with valid OTP and mandatory password', async () => {
    const res = await AuthService.registerWithOtp({
      email: testEmail,
      otp: generatedOtp,
      firstName: 'Vitest',
      lastName: 'Candidate',
      phone: '9999999999',
      password: 'Password@123',
    });

    expect(res.user.email).toBe(testEmail);
    expect(res.user.role).toBe('STUDENT');
    expect(res.accessToken).toBeDefined();
    expect(res.refreshToken).toBeDefined();
  });

  it('should reject invalid or expired OTP', async () => {
    await expect(
      OtpService.verifyOtp(testEmail, '000000', 'SIGNUP')
    ).rejects.toThrow('Invalid verification code');
  });

  it('should verify and parse mock Google OAuth credential', async () => {
    const mockCred = 'mock-google:google_vitest@example.com:Rohan Verma';
    const profile = await GoogleAuthService.verifyGoogleToken(mockCred);

    expect(profile.email).toBe('google_vitest@example.com');
    expect(profile.firstName).toBe('Rohan');
    expect(profile.lastName).toBe('Verma');
    expect(profile.emailVerified).toBe(true);
  });

  it('should sign in or auto-register user via Google OAuth', async () => {
    const mockCred = 'mock-google:google_auto_reg@example.com:Aditi Sen';
    const res = await AuthService.loginOrRegisterWithGoogle(mockCred);

    expect(res.user.email).toBe('google_auto_reg@example.com');
    expect(res.user.firstName).toBe('Aditi');
    expect(res.user.role).toBe('STUDENT');
    expect(res.accessToken).toBeDefined();
  });

  afterAll(async () => {
    // Clean up created test accounts
    const users = await prisma.user.findMany({
      where: {
        email: { in: [testEmail, 'google_auto_reg@example.com'] },
      },
      select: { id: true },
    });
    const userIds = users.map(u => u.id);

    await prisma.studentProfile.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.otpVerification.deleteMany({
      where: { email: { in: [testEmail, 'google_auto_reg@example.com'] } },
    });
  });
});
