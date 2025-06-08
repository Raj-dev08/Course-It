import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";


export default function UserProfile() {
  const { id } = useParams();
  const navigate=useNavigate();
  const { getUserProfile, clickedProfile, isLoadingUser, sendFriendRequest } = useUserStore();
  const {authUser}=useAuthStore();

  useEffect(() => {
    if (id){
        if(id===authUser?._id){
            navigate("/profile")
        }
        else{
            getUserProfile(id);
        }
    }
  }, [id]);

  if (isLoadingUser) return <Loader2 />;

  if (!clickedProfile) return <p className="text-center mt-10">User not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-[80px]">
      <div className="bg-base-300 shadow-md rounded-2xl p-6 flex flex-col gap-6 items-center">
        <img
          src={clickedProfile.profilePic}
          alt="profile"
          className="w-60 h-60 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold">{clickedProfile.name}</h2>
          <p className="text-gray-600">{clickedProfile.email}</p>
          {clickedProfile.description && (
            <p className="text-sm mt-2 text-gray-500">{clickedProfile.description}</p>
          )}
          <div className="mt-4 flex gap-3">
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Balance: ${clickedProfile.balance || 0}
            </span>
            {clickedProfile.isAdmin && (
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => sendFriendRequest(id)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send Friend Request
        </button>
      </div>
    </div>
  );
}