import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateMiddleware';
import { createInternshipSchema, updateInternshipSchema } from '../validators/internshipValidator';
import { updateConfigSchema } from '../validators/recommendationValidator';

const router = Router();

// All admin routes strictly require ADMIN role
router.use(authenticate, requireRole('ADMIN'));

router.get('/dashboard', AdminController.getDashboard);
router.get('/students', AdminController.listStudents);

router.get('/internships', AdminController.listInternships);
router.post('/internships', validateRequest(createInternshipSchema), AdminController.createInternship);
router.put('/internships/:id', validateRequest(updateInternshipSchema), AdminController.updateInternship);
router.delete('/internships/:id', AdminController.deleteInternship);

router.get('/applications', AdminController.listApplications);
router.put('/applications/:id/status', AdminController.updateApplicationStatus);

router.get('/organizations', AdminController.listOrganizations);
router.post('/organizations', AdminController.createOrganization);

router.get('/config', AdminController.getConfig);
router.put('/config', validateRequest(updateConfigSchema), AdminController.updateConfig);

router.get('/export/:entity', AdminController.exportData);

export default router;
