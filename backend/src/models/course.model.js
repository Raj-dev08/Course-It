import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:""
    },
    price:{
        type:Number,
        default:0
    },
    timings:{
        type:String,
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    students:[
        {
            studentId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            joinedCourse:{
                type: Date,
                default:()=>Date.now()
            }
        }
    ]
  },
  { timestamps: true }
);

courseSchema.index({createdAt:-1});

const Courses = mongoose.model("Courses", courseSchema);



export default Courses;