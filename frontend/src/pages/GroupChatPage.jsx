import { useGroupChatStore } from "../store/useGroupChat";
import { useAuthStore } from "../store/useAuthStore";
import GroupChatContainer from "../components/GroupChatContainer";
import { Navigate ,useNavigate} from "react-router-dom";
import { useEffect } from "react";

const GroupChatPage = () => {
  const { selectedGroup } = useGroupChatStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!selectedGroup){
      navigate("/"); // Redirect to home if no group is selected
    }

    if(selectedGroup.creator._id.toString()!==authUser._id.toString()||selectedGroup.students.some(s=>s.studentId._id.toString()!==authUser._id.toString())){
      navigate("/"); // Redirect to home if user is not part of the group
    }
  },[ ])

  return (
    <div className="h-screen bg-base-200">
    <div className="flex items-center justify-center pt-20 px-4">
      <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">


          {!selectedGroup ? <Navigate to="/"/>: <GroupChatContainer />}
        </div>
      </div>
    </div>
  </div>
  )
}

export default GroupChatPage