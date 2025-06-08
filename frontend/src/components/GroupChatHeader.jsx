import { X,Video } from "lucide-react";
import { useGroupChatStore } from "../store/useGroupChat";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selectedGroup, setSelectedGroup } = useGroupChatStore();
  const navigate=useNavigate();
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img 
              src={selectedGroup?.image || "/i.png"} alt={selectedGroup?.name} 
              className="object-cover w-full h-full rounded-full"
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedGroup?.name}</h3>
          </div>
        </div>

        {/* Close button */}
        <div className="flex space-x-9">


        <button onClick={()=>navigate(`/call/${selectedGroup._id}`)}>
          <Video />
        </button>

        <button onClick={()=>setSelectedGroup(null)}>
          <X />
        </button>

        </div>
      </div>
    </div>
  );
};
export default ChatHeader;