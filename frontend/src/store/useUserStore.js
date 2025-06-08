import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useUserStore = create((set)=>({
    clickedProfile:[],
    isLoadingUser:false,
    friendRequestToUser:[],
    friendRequestFromUser:[],
    isLoadingFriendRequest:false,
    userFriends:[],

    getUserProfile:async (profileId) => {
        set({isLoadingUser:true})
        try {
            const res= await axiosInstance.get(`/user/profile/${profileId}`)

            set({clickedProfile:res.data.profileUser})
        } catch (error) {
            console.log("error in getting user ", error);
            toast.error(error.response.data.message || "Failed to get user"); 
        }finally{
            set({isLoadingUser:false})
        }
    },

    getReceivedFriendrequests:async () => {
        set({isLoadingFriendRequest:true})
        try {
            const res = await axiosInstance.get("/user/friend-requests")
            set({friendRequestToUser:res.data.friendRequests})
        } catch (error) {
            console.log("error in getting friend requests ", error);
            toast.error(error.response.data.message || "Failed to get friend requests ");  
        }finally{
            set({isLoadingFriendRequest:false})
        }
    },
    getSentFriendrequests:async () => {
        set({isLoadingFriendRequest:true})
        try {
            const res = await axiosInstance.get("/user/my-friend-requests")
            set({friendRequestFromUser:res.data.friendRequests})
        } catch (error) {
            console.log("error in getting friend requests  ", error);
            toast.error(error.response.data.message || "Failed to get friend requests ");  
        }finally{
            set({isLoadingFriendRequest:false})
        }
    },

    acceptFriendRequest:async (requestId) => {
        try {
            const res=await axiosInstance.post(`/user/accept-friend-request/${requestId}`)
            toast.success(res.data.message);

            set((state)=>({
                friendRequestToUser:state.friendRequestToUser.filter((req)=>req._id!==requestId)
            }))

        } catch (error) {
            console.log("error in accepting friend request")
            toast.error(error.response.data.message || "Failed to accept friend request ");  
        }
    },
    
    rejectFriendRequest:async (requestId) => {
        try {
            const res=await axiosInstance.post(`/user/reject-friend-request/${requestId}`)
            toast.success(res.data.message);
            set((state)=>({
                friendRequestToUser:state.friendRequestToUser.filter((req)=>req._id!==requestId)
            }))
        } catch (error) {
            console.log("error in rejecting friend request")
            toast.error(error.response.data.message || "Failed to reject friend request ");  
        }
    },

    sendFriendRequest:async (receiverId) => {
        try {
            const res= await axiosInstance.post(`/user/send-friend-request/${receiverId}`)
            toast.success(res.data.message)
        } catch (error) {
            console.log("error in sending friend request")
            toast.error(error.response.data.message || "Failed to send friend request ");  
        }
    },

    getMyFriends:async () => {
        try {
            const res = await axiosInstance.get("/messages/friends");
            
            set({
                userFriends:res.data.friends
            })
        } catch (error) {
            console.log("error in getting friends")
            toast.error(error.response.data.message || "Failed to get friends ");  
        }
    }
}))