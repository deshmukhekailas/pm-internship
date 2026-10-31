import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../config/env';

export class MailService {
  private static transporter: Transporter | null = null;

  private static getTransporter() {
    if (!this.transporter) {
      if (config.smtpUser && config.smtpPass) {
        const isGmail = (config.smtpHost || '').toLowerCase().includes('gmail');
        this.transporter = nodemailer.createTransport({
          host: config.smtpHost || 'smtp.gmail.com',
          port: config.smtpPort || 587,
          secure: config.smtpPort === 465,
          auth: {
            user: config.smtpUser,
            pass: config.smtpPass,
          },
          ...(isGmail ? { service: 'gmail' } : {}),
          tls: {
            rejectUnauthorized: false,
          },
        });
      }
    }
    return this.transporter;
  }

  /**
   * Send One-Time Password (OTP) verification email
   */
  public static async sendOtpEmail(email: string, otp: string, type: 'SIGNUP' | 'LOGIN'): Promise<{ sent: boolean; devMode: boolean }> {
    const isSignup = type === 'SIGNUP';
    const actionTitle = isSignup ? 'Verify Your Email to Complete Registration' : 'Your Sign-In One-Time Password';
    const actionDesc = isSignup
      ? 'Thank you for registering on the Prime Minister Internship Scheme Portal. Please use the verification code below to verify your email and activate your candidate account.'
      : 'You requested a secure passwordless sign-in to your PM Internship Scheme account. Use the verification code below to sign in.';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: #002244; padding: 28px 24px; text-align: center; border-bottom: 4px solid #FF9933; }
          .logo-text { color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; margin: 0; }
          .sub-text { color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-top: 4px; letter-spacing: 1px; }
          .content { padding: 32px 28px; }
          .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
          .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .otp-box { background: #f0fdf4; border: 2px dashed #16a34a; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-label { font-size: 11px; text-transform: uppercase; color: #15803d; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; color: #002244; letter-spacing: 8px; margin: 0; }
          .expiry { font-size: 12px; color: #64748b; margin-top: 8px; }
          .warning { font-size: 12px; background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 6px; color: #92400e; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo-text">🇮🇳 PM INTERNSHIP SCHEME</h1>
            <div class="sub-text">Ministry of Corporate Affairs • Government of India</div>
          </div>
          <div class="content">
            <h2 class="title">${actionTitle}</h2>
            <p class="message">${actionDesc}</p>
            <div class="otp-box">
              <div class="otp-label">Your One-Time Password</div>
              <div class="otp-code">${otp}</div>
              <div class="expiry">⏱️ Valid for 10 minutes only</div>
            </div>
            <div class="warning">
              <strong>Security Notice:</strong> Never share this code with anyone. Official PM Internship Scheme administrators will never ask for your verification code.
            </div>
            <p class="message" style="margin-bottom: 0;">If you did not request this verification code, please ignore this email or contact support immediately.</p>
          </div>
          <div class="footer">
            © 2026 PM Internship Mission Directorate • Government of India. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    // In automated testing, skip real network SMTP calls
    if (process.env.NODE_ENV === 'test') {
      return { sent: true, devMode: true };
    }

    const transporter = this.getTransporter();

    if (transporter) {
      try {
        const fromAddress = config.smtpUser
          ? `"PM Internship Scheme" <${config.smtpUser}>`
          : config.smtpFrom;

        const info = await transporter.sendMail({
          from: fromAddress,
          to: email,
          subject: `${otp} is your PM Internship Scheme Verification Code`,
          text: `Your PM Internship Scheme verification code is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
          html: htmlContent,
        });
        console.log(`📧 [EMAIL SENT] OTP successfully delivered to ${email} (Message ID: ${info.messageId})`);
        return { sent: true, devMode: false };
      } catch (err: any) {
        console.error(`⚠️ [EMAIL FAILED] SMTP send failed: ${err.message}. Falling back to console.`);
      }
    }

    // Dev mode fallback: log clearly so testing/development works without requiring live SMTP credentials
    console.log(`\n======================================================`);
    console.log(`🔑 [DEV MODE OTP] Email: ${email}`);
    console.log(`🔑 [DEV MODE OTP] Code:  ${otp} (${type})`);
    console.log(`🔑 [DEV MODE OTP] Valid for 10 minutes`);
    console.log(`======================================================\n`);

    return { sent: true, devMode: true };
  }
}
