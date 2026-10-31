import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/env';

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  emailVerified: boolean;
}

export class GoogleAuthService {
  private static client = new OAuth2Client(config.googleClientId || undefined);

  /**
   * Verify Google OAuth2 ID Token and extract authenticated profile
   */
  public static async verifyGoogleToken(idToken: string): Promise<GoogleUserProfile> {
    if (!idToken || typeof idToken !== 'string') {
      throw new Error('Google ID token is required.');
    }

    // Dev mode mock token support for local testing/offline demo
    if (idToken.startsWith('mock-google')) {
      const parts = idToken.split(':');
      const email = parts[1] || 'google.student@example.com';
      const name = parts[2] || 'Google Candidate';
      const nameParts = name.split(' ');
      return {
        googleId: `google_mock_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: email.toLowerCase(),
        firstName: nameParts[0] || 'Google',
        lastName: nameParts.slice(1).join(' ') || 'Candidate',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        emailVerified: true,
      };
    }

    try {
      // 1. First attempt: Verify using official google-auth-library
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: config.googleClientId ? config.googleClientId : undefined,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error('Invalid Google token: missing email.');
      }

      return {
        googleId: payload.sub,
        email: payload.email.toLowerCase(),
        firstName: payload.given_name || payload.name?.split(' ')[0] || 'Candidate',
        lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || '',
        avatarUrl: payload.picture,
        emailVerified: payload.email_verified === true,
      };
    } catch (err: any) {
      // 2. Fallback: Query Google's tokeninfo endpoint directly
      try {
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
        if (!response.ok) {
          throw new Error(`Google token validation failed with status ${response.status}`);
        }
        const data: any = await response.json();
        if (!data.email) {
          throw new Error('Google token did not contain an email address.');
        }

        return {
          googleId: data.sub,
          email: data.email.toLowerCase(),
          firstName: data.given_name || data.name?.split(' ')[0] || 'Candidate',
          lastName: data.family_name || data.name?.split(' ').slice(1).join(' ') || '',
          avatarUrl: data.picture,
          emailVerified: data.email_verified === 'true' || data.email_verified === true,
        };
      } catch (fallbackErr: any) {
        throw new Error(`Google authentication failed: ${err.message || fallbackErr.message}`);
      }
    }
  }
}
