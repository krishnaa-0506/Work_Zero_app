import express from 'express';
import { auth } from '../middleware/auth';
import * as MessageController from '../controllers/MessageController';

const router = express.Router();

router.use(auth);

// Message routes
router.get('/conversations', MessageController.getConversations);
router.get('/conversations/:id', MessageController.getMessages);
router.post('/conversations/:id/messages', MessageController.sendMessage);
router.patch('/messages/:id/read', MessageController.markAsRead);

export default router;
