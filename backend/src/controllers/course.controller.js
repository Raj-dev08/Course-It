import Courses from "../models/course.model.js";
import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";


export const createCourse = async (req,res) => {
    try {
        const {user}=req;

        if(!user||!user.isAdmin){
            return res.status(401).json({message: "Anuthorized access"});
        }


        const { name, description, image, price, timings}=req.body;

        if(!name||!description||!price||!timings||!image){
            return res.status(400).json({message: "All fields required"});
        }

        const uploadedResponse = await cloudinary.uploader.upload(image);
        
        const newCourse = new Courses({
            name,
            description,
            image:uploadedResponse.secure_url,
            price,
            timings,
            creator:user._id
        });

        await newCourse.save();
        await redis.set(`course:${newCourse._id}`, JSON.stringify(newCourse),"EX",60*60*24*7);//7 days

        return res.status(201).json({newCourse});

    } catch (error) {
        console.log("Error in create course controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const joinCourse = async (req,res) => {
    try {
        const {user}=req;

        const { id :courseId}=req.params;

        if(!user){
            return res.status(401).json({message:"unauthorized access must login"});
        }

        const studentId=user._id;

        const course = await Courses.findById(courseId);

        if(!course){
            return res.status(404).json({message:"course not found"});
        }

        if (course.students.some(s => s.studentId.equals(studentId))) {
            return res.status(400).json({ message: "Already enrolled in the course" });
        }

        if(course.creator.toString()===user._id.toString()){
            return res.status(401).json({message:"Creator cant join course"});
        }

        if(user.balance<course.price){
            return res.status(400).json({message:"not enough money to buy course"});
        }

        course.students.push({studentId});

        user.balance-=course.price;
        user.courses.push(course._id);

        await course.save();
        await user.save();

        await redis.del(`clickedCourse:${courseId}`)

        return res.status(200).json({message:"Successfully joined the course"});
    } catch (error) {
        console.log("Error in join course controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getCourses = async (req,res) => {
    try {
        const search = req.query.search || "";
        const priceFilter =req.query.price;
        const limit=parseInt(req.query.limit)|| 50;
        const skip=parseInt(req.query.skip)||0;

        const searchConditions = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        };

        if(priceFilter&&!isNaN(priceFilter)){
            searchConditions.price = {$lte : Number(priceFilter)};      
        }


        const courses= await Courses.find(searchConditions)
        . populate("creator","name email profilePic") 
        .skip(skip)
        .limit(limit)
        .sort({createdAt:-1});

        const totalCourse = await Courses.countDocuments(searchConditions);

        const hasMore = skip + courses.length < totalCourse;

        return res.status(200).json({courses,hasMore});

    } catch (error) {
        console.log("Error in get course controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getUsersCourses = async (req,res) => {
    try {
        const {user}=req;

        if(!user){
            return res.status(401).json({message:"Must login"});
        }
        
        const userCourses= await Courses.find({creator:user._id}).populate("creator","name profilePic");

        if(!userCourses || userCourses.length===0){
            return res.status(200).json({message:"No courses found for this user", userCourses: []});
        }
        
        return res.status(200).json({userCourses})
    } catch (error) {
        console.log("Error in getUsersCourses course controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const seeCourses = async (req,res) => {
    try {
        const {id:courseId}=req.params;

        if(!courseId){
            return res.status(400).json({message:"must provide an id"})
        }

        const cachedCourse= await redis.get(`clickedCourse:${courseId}`);

        if(cachedCourse){
            return res.status(200).json({course:JSON.parse(cachedCourse)});
        }

        const course= await Courses.findById(courseId)
        .populate("students.studentId","name profilePic")
        .populate("creator","name email profilePic");

        if(!course){
            return res.status(404).json({message:"Not found"})
        }

        await redis.set(`clickedCourse:${courseId}`,JSON.stringify(course),"EX",60*60*24*7)
        

        return res.status(200).json({course});
    } catch (error) {
         console.log("Error in seeCourses course controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteCourse = async (req,res) => {
    try {
        const {user}=req;

        if(!user||!user.isAdmin){
            return res.status(401).json({message: "Unauthorized access"});
        }

        const {id:courseId}=req.params;

        if(!courseId){
            return res.status(400).json({message:"must provide an id"})
        }
        const course= await Courses.findById(courseId);

        if(!course){
            return res.status(404).json({message:"Not found"})
        }

        if(!course.creator.equals(user._id)){
            return res.status(401).json({message:"Unauthorized access"});
        }

        await Courses.findByIdAndDelete(courseId);
        await redis.del(`course:${courseId}`);
        await redis.del(`clickedCourse:${courseId}`)

        return res.status(200).json({message:"Course deleted successfully"});
    } catch (error) {
         console.log("Error in delete course controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateCourse = async (req,res) => {
    try {
        const {user}=req;
        const {name,description,image,price,timings}=req.body;

        if(!user||!user.isAdmin){
            return res.status(401).json({message: "Unauthorized access"});
        }

        const {id:courseId}=req.params;

        if(!courseId){
            return res.status(400).json({message:"must provide an id"})
        }

        const course= await Courses.findById(courseId);

        if(!course){
            return res.status(404).json({message:"Not found"})
        }

        if(!course.creator.equals(user._id)){
            return res.status(401).json({message:"Unauthorized access"});
        }

        if(!name||!description||!price||!timings||!image){
            return res.status(400).json({message:"atleast one field required"});
        }

        if(name) course.name=name;

        if(description) course.description=description;

        if(price) course.price=price;

        if(timings) course.timings=timings;

        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            course.image=uploadedResponse.secure_url;
        }

        
        await course.save();

        await redis.del(`course:${courseId}`); // Invalidate cache for the updated course
        await redis.del(`clickedCourse:${courseId}`)
        await redis.set(`course:${courseId}`, JSON.stringify(course),"EX",60*60*24*7);//7 days

        return res.status(200).json({message:"Course updated successfully",course});
    } catch (error) {
        console.log("Error in update course controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}