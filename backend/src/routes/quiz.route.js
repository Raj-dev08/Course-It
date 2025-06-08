import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createQuiz,getQuizFromCourse,getQuiz,startQuiz,giveQuiz,getMyQuizResults,getMyQuizzes,showResults ,deleteQuiz ,stopQuiz} from '../controllers/quiz.controller.js';

const router = express.Router();

router.post("/create-quiz/:id", protectRoute, createQuiz);

router.get("/quiz/:id", protectRoute, getQuiz);
router.get("/course-quiz/:id",protectRoute,getQuizFromCourse);
router.post("/give-quiz/:id", protectRoute, giveQuiz);
router.get("/my-quizzes", protectRoute, getMyQuizzes);
router.get("/my-quiz-results", protectRoute, getMyQuizResults);
router.get("/show-results/:id", protectRoute, showResults);
router.put("/stop/:id", protectRoute, stopQuiz);
router.delete("/delete/:id", protectRoute, deleteQuiz);
router.post("/start-quiz/:id", protectRoute, startQuiz);

export default router;