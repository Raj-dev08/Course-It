import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendMessages, getMessages } from '../controllers/groupchat.controller.js';

const router = express.Router();

router.post('/send/:groupId', protectRoute, sendMessages);
router.get('/:groupId', protectRoute, getMessages);

export default router;