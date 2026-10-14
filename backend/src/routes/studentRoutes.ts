import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateMiddleware';
import {
  updateProfileSchema,
  addEducationSchema,
  addSkillSchema,
  addProjectSchema,
  addExperienceSchema,
} from '../validators/studentValidator';
import { resumeUpload } from '../middleware/uploadMiddleware';

const router = Router();

// All student routes require authentication as STUDENT
router.use(authenticate, requireRole('STUDENT'));

router.get('/profile', StudentController.getProfile);
router.put('/profile', validateRequest(updateProfileSchema), StudentController.updateProfile);

router.post('/education', validateRequest(addEducationSchema), StudentController.addEducation);
router.delete('/education/:id', StudentController.deleteEducation);

router.post('/skills', validateRequest(addSkillSchema), StudentController.addSkill);
router.delete('/skills/:id', StudentController.deleteSkill);

router.post('/projects', validateRequest(addProjectSchema), StudentController.addProject);
router.delete('/projects/:id', StudentController.deleteProject);

router.post('/resume', resumeUpload.single('resume'), StudentController.uploadResume);
router.post('/resume/confirm', StudentController.confirmResumeData);

export default router;
