import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let rawDbUrl = process.env.DATABASE_URL || 'file:./dev.db';
if (rawDbUrl.includes('.mongodb.net/?')) {
  rawDbUrl = rawDbUrl.replace('.mongodb.net/?', '.mongodb.net/pminternship?');
  process.env.DATABASE_URL = rawDbUrl;
} else if (rawDbUrl.endsWith('.mongodb.net/') || rawDbUrl.endsWith('.mongodb.net')) {
  rawDbUrl = rawDbUrl.replace(/\.mongodb\.net\/?$/, '.mongodb.net/pminternship?retryWrites=true&w=majority');
  process.env.DATABASE_URL = rawDbUrl;
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: rawDbUrl,
  jwtSecret: process.env.JWT_SECRET || 'pm_internship_scheme_jwt_secret_super_secure_key_2026!',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'pm_internship_scheme_jwt_refresh_secret_key_2026!',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  aiProvider: process.env.AI_PROVIDER || 'LOCAL_ML',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  uploadDir: path.resolve(__dirname, '../../uploads'),
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
};
