import cloudinary from "../lib/cloudinary.js";
import GroupChat from "../models/groupchat.model.js";
import Courses from "../models/course.model.js";
import { redis } from "../lib/redis.js";
import { io } from "../lib/socket.js";


export const sendMessages = async (req, res) => {
    try {
        const { user } = req;
        const { groupId } = req.params;
        const { text, image } = req.body;


        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image required" });
        }

        let imageUrl;
        if(image){
             try {
                const uploadedResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadedResponse.secure_url;
            } catch (cloudinaryError) {
                return res.status(500).json({ message: "Image upload failed", error: cloudinaryError.message });
            }
        }

        const message = new GroupChat({
            senderId: user._id,
            groupId,
            text,
            image: imageUrl,
        });
       
        await message.save();

        await message.populate("senderId", "name profilePic");
        io.to(groupId).emit("new_message", message);
        return res.status(201).json({ message: "Message sent successfully", message });  
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { user } = req;
        const { groupId } = req.params;

        const limit = parseInt(req.query.limit) || 100;
        const before = req.query.before ;

        const cacheKey = `groupMessages:${groupId}:${limit}:${before}`;
        const cachedKey2= `groupMessages:${groupId}:${limit}:${before} hasmore`;
        const cachedMessages = await redis.get(cacheKey);
        const cachedHasMore = await redis.get(cachedKey2);

        if (cachedMessages) {
            const parsedMessages = JSON.parse(cachedMessages);
            const parsedHasMore = JSON.parse(cachedHasMore);
            return res.status(200).json({ messages: parsedMessages , hasMore: parsedHasMore });
        }

        if(!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        if(!groupId) {
            return res.status(400).json({ message: "Group ID is required" });
        }

        const group = await Courses.findById(groupId);

        if(!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (!group.students.some(s => s.studentId.toString() === user._id.toString())
            && group.creator.toString()!==user._id.toString()) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }
        
        const query = {
            groupId,
        };

        if(before) {
            query.createdAt = { $lt: before };
        }

        const messages = await GroupChat.find(query).sort({ createdAt: -1 }).limit(limit).populate("senderId", "name profilePic");
        const hasMore = messages.length === limit;

        messages.reverse(); // To return the oldest messages first

        await redis.set(cacheKey, JSON.stringify(messages), "EX", 60 * 60); // Cache for 1 hour
        await redis.set(cachedKey2, JSON.stringify(hasMore), "EX", 60 * 60); // Cache for 1 hour

        res.status(200).json({ messages, hasMore });
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}