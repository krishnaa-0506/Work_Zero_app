import express from 'express';
import { auth } from '../middleware/auth';
import * as UserController from '../controllers/UserController';

const router = express.Router();

// Auth routes
router.post('/verify-aadhaar', UserController.verifyAadhaar);
router.post('/verify-face', UserController.verifyFace);
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

// Protected routes
router.use(auth);
router.get('/profile', UserController.getProfile);
router.patch('/profile', UserController.updateProfile);
router.post('/skills', UserController.addSkills);
router.delete('/skills', UserController.removeSkills);
router.post('/experience', UserController.addExperience);
router.patch('/experience/:id', UserController.updateExperience);
router.delete('/experience/:id', UserController.deleteExperience);

export default router;
