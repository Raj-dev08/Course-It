import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, sendMessage ,getFriends} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/friends", protectRoute, getFriends);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;