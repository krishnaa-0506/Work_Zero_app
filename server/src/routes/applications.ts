import express from 'express';
import { auth } from '../middleware/auth';
import * as ApplicationController from '../controllers/ApplicationController';

const router = express.Router();

router.use(auth);

// Application routes
router.get('/', ApplicationController.getApplications);
router.get('/:id', ApplicationController.getApplication);
router.put('/:id/status', ApplicationController.updateApplicationStatus);
router.put('/:id/withdraw', ApplicationController.withdrawApplication);

export default router;
