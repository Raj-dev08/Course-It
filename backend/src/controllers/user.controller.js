import User from "../models/user.model.js";
import FriendRequest from "../models/freindrequest.model.js";
import { redis } from "../lib/redis.js";


export const getFriendRequests = async (req, res) => {
    try {
        const myId = req.user._id;

        if (!myId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const getCachedFriendRequests = await redis.get(`friendRequests:${myId}`);

        if(getCachedFriendRequests){
            return res.status(200).json({friendRequests:JSON.parse(getCachedFriendRequests)});
        }
        const friendRequests = await FriendRequest.find({
            receiver: myId,
            status: "pending",
        }).populate("sender", "name email profilePic");

        if(!friendRequests) {
            return res.status(404).json({ message: "No friend requests found" });
        }

        await redis.set(`friendRequests:${myId}`, JSON.stringify(friendRequests), "EX", 60 * 60); // Cache for 1 hour

        res.status(200).json({friendRequests});
    } catch (error) {
        console.log("Error in getFriendRequests controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMyFriendRequests = async (req, res) => {
    try {
        const myId = req.user._id;

        if (!myId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const getCachedFriendRequests = await redis.get(`sentFriendRequests:${myId}`);

        if(getCachedFriendRequests){
            return res.status(200).json({friendRequests:JSON.parse(getCachedFriendRequests)});
        }
        const friendRequests = await FriendRequest.find({
            sender: myId,
            status: "pending",
        }).populate("receiver", "name email profilePic");

        if(!friendRequests) {
            return res.status(404).json({ message: "No friend requests found" });
        }

        await redis.set(`sentFriendRequests:${myId}`, JSON.stringify(friendRequests), "EX", 60 * 60); // Cache for 1 hour

        res.status(200).json({friendRequests});
    } catch (error) {
        console.log("Error in getMyFriendRequests controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user._id;

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        if (senderId.toString() === receiverId.toString()) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const existingRequest = await FriendRequest.findOne({
            sender: senderId,
            receiver: receiverId,
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        const newRequest = new FriendRequest({
            sender: senderId,
            receiver: receiverId,
        });

        await newRequest.save();

        await redis.del(`friendRequests:${receiverId}`); // Invalidate cache for receiver's friend requests
        await redis.del(`friendRequests:${senderId}`); // Invalidate cache for sender's friend requests

        res.status(201).json({ message: "Friend request sent successfully" });
    } catch (error) {
        console.log("Error in sendFriendRequest controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const acceptFriendRequest = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const userId = user._id;
        const { requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);//getting the request by id

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.receiver.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        if(friendRequest.status !== "pending") {
            return res.status(400).json({ message: "Friend request is not pending" });
        }

        friendRequest.status = "accepted";


        const senderId = friendRequest.sender;//getting the sender id

        const sender = await User.findById(senderId);

        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        if (!user.friends.includes(senderId)) {
            user.friends.push(senderId);
        }

        if (!sender.friends.includes(userId)) {
            sender.friends.push(userId);
        }

        await friendRequest.save();

        await sender.save();

        await user.save();

        await redis.del(`friendRequests:${userId}`); // Invalidate cache for receiver's friend requests
        await redis.del(`friendRequests:${senderId}`); // Invalidate cache for sender's friend requests

        await redis.del(`friends:${userId}`);
        await redis.del(`friends:${senderId}`);

        return res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.log("Error in acceptFriendRequest controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const rejectFriendRequest = async (req, res) => {
    try {
        const userId = req.user._id;

        const { requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        if (friendRequest.receiver.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to reject this request" });
        }

        if(friendRequest.status !== "pending") {
            return res.status(400).json({ message: "Friend request is not pending" });
        }
        const senderId = friendRequest.sender;

        friendRequest.status = "rejected";

        await friendRequest.save();

        await redis.del(`friendRequests:${userId}`); // Invalidate cache for receiver's friend requests
        await redis.del(`friendRequests:${senderId}`); // Invalidate cache for sender's friend requests

        
        await redis.del(`friends:${userId}`);
        await redis.del(`friends:${senderId}`);
        
        return res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        console.log("Error in rejectFriendRequest controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateBalance = async (req, res) => {
    try {
        const { user } = req;
        const { amount } = req.body;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        user.balance += Number(amount);
        await user.save();

        return res.status(200).json({ message: "Balance updated successfully"});
    } catch (error) {
        console.log("Error in updateBalance controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
        
    }
}

export const beAdmin = async(req,res)=>{
    try {
        const { user } = req;

        const {password} = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        if (user.isAdmin) {
            return res.status(400).json({ message: "User is already an admin" });
        }

        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ message: "Invalid password" });
        }

        user.isAdmin=true;
        await user.save();

        return res.status(200).json({ message: "User promoted to admin" });
    } catch (error) {
        console.log("Error in beAdmin controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const cancelAdmin = async(req,res)=>{
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        if (!user.isAdmin) {
            return res.status(400).json({ message: "User is not an admin" });
        }

        user.isAdmin=false;
        await user.save();

        return res.status(200).json({ message: "User demoted to regular user" });
    } catch (error) {
        console.log("Error in cancelAdmin controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const viewProfile=async (req,res) => {
    try {
        const {profileId}=req.params
        const {user}=req

        if(!user){
            return res.status(401).json({message:"unauthorized access"})
        }
       

        const profileUser = await User.findById(profileId).select("-password")

        if(!profileUser){
            return res.status(404).json({message:"user not found"})
        }

        return res.status(200).json({profileUser});

    } catch (error) {
        console.log("Error in viewprofile controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
