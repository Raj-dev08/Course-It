import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useGroupChatStore = create((set,get)=>({
    messages: [],
    hasMoreMessages:true,
    selectedGroup: null,
    isMessagesLoading: false,
    isSendingMessage: false,
    typingUsers:[],

    refreshMessages:()=>{
        set({messages:[],hasMoreMessages:true})
    },

    getMessages:async(id,limit,before)=>{
      set({isMessagesLoading:true});
      try {
          const res = await axiosInstance.get(`/groupchat/${id}?limit=${limit}&before=${before}`);
          
          const currentMessages = get().messages;
          const existingMessages = new Set(get().messages.map(message => message._id));
          const newMessage = res.data.messages.filter(message => !existingMessages.has(message._id));
          
          set({
              messages:[...newMessage,...currentMessages],
              hasMoreMessages:res.data.hasMore
          })
      } catch (error) {
          console.log("error in getting messages", error);
          toast.error(error.response.data.message || "Failed to load messages");
      }finally{
        set({isMessagesLoading:false})
      }
  },
  sendMessages: async (data) => {
    set({ isSendingMessage: true });
    try {
      const { selectedGroup, messages } = get();
      const res = await axiosInstance.post(`/groupchat/send/${selectedGroup._id}`, data);
      const newMessage = res.data.message;
      set({ messages: [...messages, newMessage] });
    } catch (error) {
      console.log("Error sending message:", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    }finally {
      set({ isSendingMessage: false });
    }
  },

  joinGroupChat:()=>{
    const {selectedGroup}=get()

    

    const socket = useAuthStore.getState().socket

    if(!selectedGroup||!socket)return

    socket.emit("joinGroup",selectedGroup._id)
  },

  setSocketListener:()=>{
    const socket = useAuthStore.getState().socket

    if(!socket) return

    socket.off("new_message");

    socket.on("new_message",(message)=>{
        const { selectedGroup, messages } = get();

        const sameGroup=message.groupId===selectedGroup._id
        if(!sameGroup)return
        
        set({messages:[...messages,message]});
    })
  },


  setTypingIndicator:()=>{
    const socket = useAuthStore.getState().socket

    const {selectedGroup}=get()

    if(!selectedGroup||!socket)return 

    socket.on("userTyping",({from})=>{
      const typingUsers = get().typingUsers;



      if (!typingUsers.includes(from)) {
        set({ typingUsers: [...typingUsers, from] });
      }
    })

    socket.on("userStoppedTyping",({from})=>{
      const {typingUsers}=get()
      

      set({typingUsers:typingUsers.filter((user)=>user._id!==from._id)})
    })
  },

  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
}))