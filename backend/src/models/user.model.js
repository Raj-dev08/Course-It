import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    balance:{
        type:Number,
        default:0
    },
    description: {
        type: String,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
    },
    profilePic: {
        type: String,
        default: "https://img.freepik.com/premium-vector/vector-young-man-anime-style-character-vector-illustration-design-manga-anime-boy_147933-12445.jpg?semt=ais_hybrid&w=740",
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
             ref:"Courses",    
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;