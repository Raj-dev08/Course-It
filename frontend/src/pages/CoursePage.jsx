import { useState } from "react"
import { useCourseStore } from "../store/useCourse"
import CourseHandler from "../components/CourseHandler"


const CoursePage = () => {
    const [courseData, setCourseData] = useState({
        description: "",
        name: "",
        timings: "",
        price: 1,
        image:""
    })  

    const { createCourse, isCreatingCourse } = useCourseStore();


    

  return (
    <div>
        <CourseHandler
            courseData={courseData}
            setCourseData={setCourseData}
            createCourse={createCourse}
            isCreatingCourse={isCreatingCourse}
            mode="create"
        />
    </div>
  )
}

export default CoursePage
