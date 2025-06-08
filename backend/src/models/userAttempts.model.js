import mongoose from "mongoose";

const userAttemptsSchema= new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        quizId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Quiz",
            required:true
        }
    }
)

const userAttempts = mongoose.model("UserAttempts",userAttemptsSchema);
export default userAttempts;