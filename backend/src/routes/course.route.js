import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createCourse ,joinCourse ,getCourses,getUsersCourses,seeCourses,deleteCourse,updateCourse} from '../controllers/course.controller.js';

const router =express.Router();

router.post("/create-course",protectRoute,createCourse)

router.get("/",getCourses)
router.get("/profile",protectRoute,getUsersCourses)
router.get("/:id",seeCourses)

router.post("/join/:id",protectRoute,joinCourse)

router.delete("/delete/:id",protectRoute,deleteCourse)
router.put("/update/:id",protectRoute,updateCourse)

export default router;