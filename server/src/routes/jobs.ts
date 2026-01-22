import express from 'express';
import { auth } from '../middleware/auth';
import * as JobController from '../controllers/JobController';

const router = express.Router();

// Public routes
router.get('/', JobController.getJobs);
router.get('/:id', JobController.getJob);

// Protected routes
router.use(auth);
router.post('/', JobController.createJob);
router.put('/:id', JobController.updateJob);
router.delete('/:id', JobController.deleteJob);

export default router;
