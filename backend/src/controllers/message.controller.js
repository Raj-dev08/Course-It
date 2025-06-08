import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { redis } from "../lib/redis.js";


export const getFriends = async (req, res) => {
    try {
        const myId=req.user._id;

        if(!myId){
            return res.status(401).json({message: "Unauthorized access"});
        }

        const getCachedFriends = await redis.get(`friends:${myId}`);

        if (getCachedFriends) {
            return res.status(200).json({friends:JSON.parse(getCachedFriends)});
        }


        const friends = await User.findById(myId).populate("friends","name email profilePic" );

        if (!friends) {
            return res.status(404).json({ message: "No friends found" });
        }

        await redis.set(`friends:${myId}`, JSON.stringify(friends), "EX", 60 * 60); // Cache for 1 hour

        return res.status(200).json({ friends });

    } catch (error) {
        console.log("Error in getFriends controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const before = req.query.before ;
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const cacheKey= `messages:${myId}:${userToChatId}:${limit}:${before}`;
    const cacheKey2= `messages:${userToChatId}:${myId}:${limit}:${before} hasmore`;

    const cachedMessages = await redis.get(cacheKey);
    const cachedHasMore = await redis.get(cacheKey2);
    if (cachedMessages&&cachedHasMore) {
      return res.status(200).json({messages:JSON.parse(cachedMessages),hasMore:JSON.parse(cachedHasMore)});
    }

    const query = {
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    };

    if (before) {
      query.createdAt = { $lt: before};
    }


    const messages= await Message.find(query).sort({ createdAt: -1 }).limit(limit);
    
    messages.reverse(); 
    await Message.updateMany(
    {
      $or: [
        { senderId: userToChatId, receiverId: myId }
      ],
      isSeen: { $ne: true }
    },
    { $set: { isSeen: true } }
    );

    await redis.set(cacheKey, JSON.stringify(messages),"EX", 60 * 60); // Cache for 1 hour

    const hasMore = messages.length === limit;


    await redis.set(cacheKey2, JSON.stringify(hasMore),"EX", 60 * 60); // Cache for 1 hour
    

    res.status(200).json({messages, hasMore});
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

  const receiverSocketId = getReceiverSocketId(receiverId);
  const senderSocketId = getReceiverSocketId(senderId);

  // Send message to the receiver if online
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  //send message to the sender if online
  if (senderSocketId && senderSocketId !== receiverSocketId) {
    io.to(senderSocketId).emit("newMessage", newMessage);
  }

    res.status(201).json({message:newMessage});
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};