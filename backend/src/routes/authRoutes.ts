import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest } from '../middleware/validateMiddleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  sendOtpSchema,
  verifyOtpSchema,
  loginOtpSchema,
  registerOtpSchema,
  googleAuthSchema,
} from '../validators/authValidator';
import { authenticate } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Standard Password Auth
router.post('/register', authLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), AuthController.login);

// Email OTP Auth
router.post('/send-otp', authLimiter, validateRequest(sendOtpSchema), AuthController.sendOtp);
router.post('/verify-otp', authLimiter, validateRequest(verifyOtpSchema), AuthController.verifyOtp);
router.post('/login-otp', authLimiter, validateRequest(loginOtpSchema), AuthController.loginWithOtp);
router.post('/register-otp', authLimiter, validateRequest(registerOtpSchema), AuthController.registerWithOtp);

// Google OAuth
router.post('/google', authLimiter, validateRequest(googleAuthSchema), AuthController.googleAuth);

// Session & Profile
router.post('/refresh', validateRequest(refreshTokenSchema), AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.me);

export default router;
