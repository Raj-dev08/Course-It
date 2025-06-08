import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export const IncomingRequests = () => {
  const {
    getReceivedFriendrequests,
    friendRequestToUser,
    isLoadingUser,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useUserStore();

  useEffect(() => {
    getReceivedFriendrequests();
  }, []);

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-4">Incoming Friend Requests</h2>
      {friendRequestToUser.length === 0 ? (
        <p className="text-gray-600">No incoming friend requests.</p>
      ) : (
        <ul className="space-y-4">
          {friendRequestToUser.map((req) => (
            <li key={req._id} className="flex justify-between items-center bg-base-300 shadow-md p-4 rounded-xl">
              <div className="flex">
                <img 
                src={req.sender.profilePic}
                className="w-12 h-12 rounded-full"/>

                <div className="mx-3">
                <Link to={`/profile/${req.sender._id}`} className="text-blue-600 hover:underline">
                  {req.sender.name}
                </Link>
                <p className="text-sm text-gray-500">{req.sender.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-success" 
                onClick={() => acceptFriendRequest(req._id)}>Accept</button>
                <button className="btn btn-error"
                onClick={() => rejectFriendRequest(req._id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export const OutgoingRequests = () => {
  const { getSentFriendrequests, friendRequestFromUser, isLoadingUser } = useUserStore();

  useEffect(() => {
    getSentFriendrequests();
  }, []);

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-semibold mb-4">Outgoing Friend Requests</h2>
      {friendRequestFromUser.length === 0 ? (
        <p className="text-gray-600">No outgoing friend requests.</p>
      ) : (
        <ul className="space-y-4">
          {friendRequestFromUser.map((req) => (
            <li key={req._id} className="flex justify-between items-center bg-base-300 shadow-md p-4 rounded-xl">
              <div className="flex">
                <img 
                src={req.receiver.profilePic}
                className="w-12 h-12 rounded-full"/>
                <div className="mx-3">
                <Link to={`/profile/${req.receiver._id}`} className="text-blue-600 hover:underline">
                  {req.receiver.name}
                </Link>
                <p className="text-sm text-gray-500">{req.receiver.email}</p>
                </div>
              </div>
              <span className="text-gray-500 text-sm">Pending</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};