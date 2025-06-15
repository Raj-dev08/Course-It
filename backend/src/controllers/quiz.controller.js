import Course from '../models/course.model.js';
import Quiz from '../models/quiz.model.js';
import userAttempts from '../models/userAttempts.model.js';

import { redis } from '../lib/redis.js';


export const createQuiz = async (req, res) => {
    try {
        const { user } = req;
        const { name, description, questions, duration } = req.body;

        if (!user || !user.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const courseId = req.params.id;
        if (!courseId) {
            return res.status(400).json({ message: 'Course ID is required' });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }


        if(course.creator.toString() !== user._id.toString()){
            return res.status(401).json({message: "Unauthorized access"});
        }

        if (!name || !description || !questions || !duration) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newQuiz = new Quiz({
            courseId,
            name,
            description,
            questions,
            duration,
            creator: user._id,
        });

        await newQuiz.save();

        const safeQuizData = {
            questions: newQuiz.questions.map(q => ({
                question: q.question,
                options: q.options,
            })),
            name: newQuiz.name,
            status:newQuiz.status?"Active":"Stopped",
            description: newQuiz.description,
            duration: newQuiz.duration,
        };

        await redis.set(`quiz:${newQuiz._id}`, JSON.stringify(safeQuizData), 'EX', 60 * 60 * 24 * 7);

        return res.status(201).json({ message:"quiz created successfully" });
    } catch (error) {
        console.log('Error in create quiz controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const getQuizFromCourse= async (req,res) => {
    try {
        const {user}=req

        if(!user){
            return res.status(401).json({message:"Unauthorized access"})
        }


        const courseId=req.params.id


        if(!courseId){
            return res.status(404).json({message:"course not found"})
        }
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if(!course.students.some(s => s.studentId.equals(user._id))) {
            return res.status(401).json({ message: 'Unauthorized access Not a student' });
        }
        let quiz=await Quiz.find({courseId:courseId})

        if(quiz.length===0){
            return res.status(200).json({message:"no quiz found"})
        }

        quiz = quiz.filter(q =>
            !q.students.some(s => s.studentId.toString() === user._id.toString())
        );


        const safeQuizData=quiz.map((q)=>({
            id:q._id,
            name:q.name,
            status:q.status?"Active":"Stopped",
            duration:q.duration,
            description:q.description
        }))

        return res.status(200).json({quiz:safeQuizData})
    } catch (error) {
        console.log('Error in get quiz by course controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const getQuiz = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const quizId = req.params.id;

        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required' });
        }

        const cachedQuiz = await redis.get(`quiz:${quizId}`);

        if (cachedQuiz) {
            return res.status(200).json({ quiz: JSON.parse(cachedQuiz) });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const questions = quiz.questions.map(q => ({
            question: q.question,
            options: q.options,
        }));


        const safeQuizData = {
        questions,
        status:quiz.status?"Active":"Stopped",
        name: quiz.name,
        description: quiz.description,
        duration: quiz.duration,
        };

        await redis.set(`quiz:${quizId}`, JSON.stringify(safeQuizData), 'EX', 60 * 60 * 24 * 7); // 7 days

        return res.status(200).json({ quiz: safeQuizData });

    } catch (error) {
        console.log('Error in get quiz controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const startQuiz = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        

        const quizId = req.params.id;

        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required' });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if(!quiz.status){
            return res.status(400).json({message:'The quiz has been stopped'})
        }

        const course = await Course.findById(quiz.courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        
        

        const cacheStart=await redis.get(`start-time:${quizId},user:${user._id}`)

        if(cacheStart){
            return res.status(200).json({message:"aleady started the quiz",startTime:Number(cacheStart)})
        }

        const isAttemptted=await userAttempts.findOne({$and:[
                    {'userId': user._id },
                    {'quizId':quizId}
                ]});

        if(isAttemptted){
            return res.status(400).json({message:'You already attempted the quiz once'});
        }

        await userAttempts.create({
            userId:user._id,
            quizId
        })


        const startTime=Date.now();

        await redis.set(`start-time:${quizId},user:${user._id}`, startTime, 'EX', quiz.duration * 60); // Store start time for quiz duration


        return res.status(200).json({message:"quiz started succesfully",startTime})
    } catch (error) {
        console.log('Error in start quiz controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const giveQuiz = async (req, res) => {
    try {
        const { user } = req;

        const quizId = req.params.id;


        if(!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }


        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required' });
        }
        

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const course = await Course.findById(quiz.courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

       

        if(!course.students.some(s => s.studentId.equals(user._id))) {
            return res.status(401).json({ message: 'not a student' });
        }

        if(course.creator.toString()===user._id.toString()){
            return res.status(401).json({message:"admin cant give tests"})
        }
        
        const  answers  = req.body;


        if (!answers) {
            return res.status(400).json({ message: 'Answers are required' });
        }

        const startTime = await redis.get(`start-time:${quizId},user:${user._id}`);
        // Check if the quiz has been started and is still valid
        if (!startTime) {
            return res.status(400).json({ message: 'Quiz has not been started or has expired' });
        }

        const alreadyAttempted = quiz.students.find(s => s.studentId.equals(user._id));

        if (alreadyAttempted) {
            return res.status(400).json({ message: 'You have already submitted this quiz' });
        }

        if (!Array.isArray(answers) || answers.length > quiz.questions.length) {
            return res.status(400).json({ message: 'Answers must be an array matching question count not higher' });
        }


        const correctAnswers = quiz.questions.map(q => q.correctAnswer);

        const score = correctAnswers.reduce((acc, correctAnswer, index) => {
            return acc + (correctAnswer === answers[index] ? 1 : 0);
        }, 0);

        quiz.students.push({
            studentId: user._id,
            score
        });

        await quiz.save();

        await redis.del(`quiz:${quizId}`); // Invalidate cache for quiz
        await redis.del(`start-time:${quizId},user:${user._id}`); // Invalidate start time for quiz



        return res.status(200).json({ message: 'Quiz submitted successfully', score });

    } catch (error) {
        console.log('Error in give quiz controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getMyQuizzes = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const quizzes = await Quiz.find({ creator: user._id });

        if (!quizzes) {
            return res.status(200).json({ message: 'No quizzes found' ,quizzes: []});
        }

        return res.status(200).json({ quizzes });
    } catch (error) {
        console.log('Error in get my quizzes controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getMyQuizResults = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const {courseId}=req.query

        let query={
            'students.studentId': user._id 
        };

        if(courseId){
            query={
                $and:[
                    {'students.studentId': user._id },
                    {'courseId':courseId}
                ]
            }
        }

        const quizzes = await Quiz.find(query).populate('courseId','image name');

        if (!quizzes) {
            return res.status(200).json({ message: 'No quizzes found' , quizzes: [] });
        }


        return res.status(200).json({ quizzes: quizzes.map(quiz => ({
            course: {
                name: quiz.courseId?.name,
                image: quiz.courseId?.image
            },
            quizId: quiz._id,
            name: quiz.name,
            duration: quiz.duration,
            score: quiz.students.find(s => s.studentId.equals(user._id))?.score,
            totalQuestions: quiz.questions.length,
            })) 
        });
    } catch (error) {
        console.log('Error in get my quiz results controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const showResults = async (req, res) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const quizId = req.params.id;

        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required' });
        }

        const quiz = await Quiz.findById(quizId).populate('creator','name').populate('students.studentId','name profilePic');


        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if(quiz.status){
            return res.status(400).json({message:"quiz still ongoing"})
        }


        return res.status(200).json({ quiz});
    } catch (error) {
        console.log('Error in show results controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteQuiz = async (req, res) => {
    try {
        const { user } = req;

        if (!user || !user.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const quizId = req.params.id;

        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required' });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (quiz.creator.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        await Quiz.findByIdAndDelete(quizId);

        await redis.del(`quiz:${quizId}`); // Invalidate cache for quiz

        return res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.log('Error in delete quiz controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const stopQuiz = async (req, res) => {
    try {
        const { user } = req;

        if (!user || !user.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const quizId = req.params.id;

        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required' });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (quiz.creator.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        quiz.status=false;

        await quiz.save();

        await redis.del(`quiz:${quizId}`); // Invalidate cache for quiz

        return res.status(200).json({ message: 'Quiz stopped successfully' });
    } catch (error) {
        console.log('Error in delete quiz controller', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//no update feautue as it gonna give some stundents the chance to cheat
// and also it is not a good practice to update quiz cause its sort of like a test
// so we just delete the quiz and create a new one and be equal to all