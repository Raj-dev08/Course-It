import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status:{
            type:Boolean,
            default:true
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },
                correctAnswer: {
                    type: Number , 
                    required: true,
                },
                options: [
                    {
                        option: {
                            type: String,
                            required: true,
                        },
                        index:{
                            type: Number,
                            required: true,
                        }
                    },
                ],
            },
        ],
        duration: {
            type: Number,
            required: true,
        },
        students: [
            {
                studentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                score: {
                    type: Number,
                    default: 0,
                },
                attemptedAt: {
                    type: Date,
                    default:()=> Date.now(),
                },
            },
        ],

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;