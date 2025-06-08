import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { Users, Loader2, Circle } from "lucide-react";
import { Link } from "react-router-dom";

const FriendList = () => {
  const { setSelectedUser } = useChatStore();
  const { getMyFriends, userFriends, isLoadingUser } = useUserStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getMyFriends();
  }, []);

  const filteredFriends = showOnlineOnly
    ? userFriends?.friends?.filter((user) => onlineUsers.includes(user._id))
    : userFriends?.friends;

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center mt-10">
        <Loader2 className="animate-spin h-6 w-6 text-primary" />
      </div>
    );
  }

  return (
    <div className="mt-[80px] bg-base-100 p-4 rounded-md shadow min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-semibold flex">My Friends <Users className="mx-3 cursor-pointer hover:text-green-600"/></h2>
        <button
          onClick={() => setShowOnlineOnly(!showOnlineOnly)}
          className="text-sm font-bold text-primary hover:underline"
        >
          {showOnlineOnly ? "Show All" : "Show Online"}
        </button>
      </div>

      {filteredFriends?.length === 0 ? (
        <p className="text-sm text-neutral-500">No friends found.</p>
      ) : (
        <ul className="space-y-3">
          {filteredFriends?.map((user) => (
            <Link to="/messages">
            <li
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition hover:bg-base-300 my-3 `}
            >
              <div className="relative w-10 h-10">
                <img
                  src={user.profilePic || "/default-avatar.png"}
                  alt={user.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              <div className="flex flex-col">
                <span className="font-medium text-s">{user.name}</span>
                <span className="text-xs">{user.email}</span>
              </div>
            </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendList;
