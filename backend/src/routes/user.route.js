import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {getFriendRequests,
        getMyFriendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        updateBalance,
        beAdmin,
        cancelAdmin,
        viewProfile} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/friend-requests", protectRoute, getFriendRequests);
router.get("/my-friend-requests", protectRoute, getMyFriendRequests);
router.post("/send-friend-request/:receiverId", protectRoute, sendFriendRequest);
router.post("/accept-friend-request/:requestId", protectRoute, acceptFriendRequest);
router.post("/reject-friend-request/:requestId", protectRoute, rejectFriendRequest);

router.post("/update-balance", protectRoute, updateBalance);

router.post("/be-admin", protectRoute, beAdmin);
router.post("/cancel-admin", protectRoute, cancelAdmin);
router.get("/profile/:profileId",protectRoute,viewProfile)


export default router;