import { useState } from "react"
import { useCourseStore } from "../store/useCourse"
import CourseHandler from "../components/CourseHandler"

const EditPage = () => {
    const {updatingCourse,isCreatingCourse,updateCourse}=useCourseStore();

    const [courseData,setCourseData]=useState(updatingCourse)

    console.log(courseData)

  return (
    <div>
        <CourseHandler
            courseData={courseData}
            setCourseData={setCourseData}
            createCourse={updateCourse}
            isCreatingCourse={isCreatingCourse}
            mode="edit"
        />
    </div>
  )
}

export default EditPage