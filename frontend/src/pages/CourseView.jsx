import { useParams } from "react-router-dom"
import { useCourseStore } from "../store/useCourse"
import { useGroupChatStore } from "../store/useGroupChat"
import { useEffect } from "react"
import { Link } from "react-router-dom"

const CourseView = () => {
    const {id}=useParams();
    const {clickedCourse,clickCourse}=useCourseStore();
    const {setSelectedGroup}=useGroupChatStore();


    useEffect(()=>{
        if(!id)return;
        clickCourse(id);
    },[id])

    
    
  return (
     <div className="flex flex-col items-center h-screen">
      <div className="card w-full bg-base-300 shadow-xl mt-[100px]">
        <div className="card-body flex flex-col items-cente bg-base-300">
        <div className="flex items-center p-4">
              <img
                src={clickedCourse?.creator.profilePic || "/avatar.png"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
                <div className="ml-3">
                  <p className="font-semibold">{clickedCourse?.creator.name.toUpperCase()}</p>
                </div>
          </div>
          <figure className="w-full h-[300px] flex items-center justify-center">
            <img
              src={clickedCourse?.image}
              alt="Product"
              className="object-contain w-full h-full rounded-lg bg-base-100"
            />
          </figure>
        </div>
        <div className="card-body p-10">
          <h2 className="card-title p-10 flex flex-col items-center">{clickedCourse?.name.toUpperCase()}</h2>

          <div className="flex my-5 text-lg justify-between font-bold">
            <p>Price: ${clickedCourse?.price}</p>
            <p className="flex justify-end">{clickedCourse?.timings}</p>
          </div>

          <p className="text-lg font-bold hover:text-zinc-400 hover: cursor-pointer">{clickedCourse?.description.toUpperCase()}</p>

          <div className="flex my-5 text-lg text-blue-500 justify-between">
            <u><Link to="/chat" className=" hover:text-blue-300" onClick={()=>setSelectedGroup(clickedCourse)}>GroupChat</Link></u>
            <u><Link to={`/quizes/${id}`} className=" hover:text-blue-300">Quizes</Link></u>
          </div>

          <p className="text-md font-semibold  hover:text-zinc-400 hover: cursor-pointer my-3 flex justify-end">{clickedCourse?.students.length}+ students learning this</p>

        </div>
      </div>
    </div>
  )
}

export default CourseView