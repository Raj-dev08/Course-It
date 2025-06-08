import { useGroupChatStore } from "../store/useGroupChat";
import GroupChatContainer from "../components/GroupChatContainer";
import { Navigate } from "react-router-dom";

const GroupChatPage = () => {
  const { selectedGroup } = useGroupChatStore();

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