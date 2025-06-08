import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        groupId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

groupChatSchema.index({ createdAt: -1 });

const GroupChat = mongoose.model("GroupChat", groupChatSchema);
export default GroupChat;