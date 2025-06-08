import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";




export const useChatStore = create((set, get) => ({
  messages: [],
  hasMoreMessages:true,
  selectedUser: null,
  isMessagesLoading: false,
  isSendingMessages: false,
  typingUsers:[],

  refreshMessages:()=>{
    set({messages:[],hasMoreMessages:true})
  },

  getMessages:async(id,limit,before)=>{
    set({isMessagesLoading:true});
    try {
        const res = await axiosInstance.get(`/messages/${id}?limit=${limit}&before=${before}`);
        
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
  sendMessage: async (data) => {
    set({ isSendingMessages: true });
    try {
      const { selectedUser, messages } = get();
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);

      set({ messages: [...messages, res.data.message] });
    } catch (error) {
      console.log("Error sending message:", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    }finally {
      set({ isSendingMessages: false });
    }
  },

  subscribeToMessages:()=>{
    const {selectedUser}=get()

    if(!selectedUser)return

    const socket = useAuthStore.getState().socket;
    
    socket.off("newMessage");

    socket.on("newMessage",(newMessage)=>{
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      newMessage.isSeen=true;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  setTypingIndicator:()=>{
    const socket = useAuthStore.getState().socket

    const {selectedUser}=get()

    if(!selectedUser||!socket)return 

    socket.on("userTypingToUser",({from})=>{
      const {selectedUser}=get()

      const isOnUser = selectedUser._id===from

      if(!isOnUser)return 
      set({typingUsers:from})
    })

    socket.on("userStoppedTypingToUser",()=>{
      set({typingUsers:[]})
    })
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

}));