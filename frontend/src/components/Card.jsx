import {motion} from "framer-motion"
import { Link } from "react-router-dom"
import { useCourseStore } from "../store/useCourse"

const Card = ({course}) => {
  const {joinCourse}=useCourseStore();
  return (
    <motion.div key={course._id} 
          className="shadow-md rounded-lg overflow-hidden border-primary/25 border-2 bg-base-300"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="flex items-center p-4">
              <img
                src={course?.creator?.profilePic || "/i.png"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link to={`/profile/${course.creator._id}`}>
                <div className="ml-3">
                  <p className="font-semibold">{course.creator.name.toUpperCase()}</p>
                  <p className="text-sm">{new Date(course.createdAt).toLocaleString()}</p>
                </div>
              </Link>
            </div>

            <Link to={`${course.image}`}>
              <img src={course.image} alt="course" className="w-full object-contain" />
            </Link>

            <Link to={`/course/${course._id}`}><p className="p-4 text-lg font-bold text-center text-blue-500 text underline">{course.name.toUpperCase()}</p></Link>
            <span className="p-4 flex justify-between">
              <p className="p-4 font-semibold"><del className="text-gray-500">${course.price+course.price*(9.231/100).toFixed(2)}</del> ${course.price}</p>
              <p className="p-4 text-gray-400">{course.timings.replace(" ","-")}</p>
            </span>
            <div className="flex justify-center my-4">
              <button className="btn btn-primary w-[40%]" onClick={()=>joinCourse(course._id)}>
                join
              </button>
            </div>
          </motion.div>
  )
}

export default Card