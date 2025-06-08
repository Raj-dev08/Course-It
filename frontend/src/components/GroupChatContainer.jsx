import { useEffect, useRef } from "react";
import { useGroupChatStore } from "../store/useGroupChat";
import { useAuthStore } from "../store/useAuthStore";
import GroupChatHeader from "./GroupChatHeader";
import MessageInput from "./MessageInput";
import { Loader2  } from "lucide-react";
import {  Link } from "react-router-dom";

const SCROLL_THRESHOLD = 100;

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        hasMoreMessages,
        isMessagesLoading,
        selectedGroup,
        joinGroupChat,
        setSocketListener,
        refreshMessages,
        typingUsers,
        setTypingIndicator
    } = useGroupChatStore();

    const {authUser,checkAuth} = useAuthStore();

    

    // console.log(authUser)

    const containerRef = useRef(null);
    const limit = 10;

    // console.log(selectedUser)

    // console.log(typingUsers)


  useEffect(() => {
    if (!selectedGroup) return
    refreshMessages();
    checkAuth();
    getMessages(selectedGroup._id, limit, Date.now());
    joinGroupChat();
    setSocketListener();
    setTypingIndicator();
  }, [selectedGroup, getMessages, joinGroupChat, refreshMessages, setSocketListener,setTypingIndicator]);


  const handleScroll = async () => {
    if (!containerRef.current) return;
    if (isMessagesLoading) return; 

    const scrollTop = containerRef.current.scrollTop;

    if (scrollTop < SCROLL_THRESHOLD && hasMoreMessages) {

    
      const oldestMessage = messages[0];
      const before = oldestMessage?.createdAt;

      
      const oldScrollHeight = containerRef.current.scrollHeight;

      await getMessages(selectedGroup._id, limit, before);

      
      const newScrollHeight = containerRef.current.scrollHeight;

      containerRef.current.scrollTop = newScrollHeight - oldScrollHeight + scrollTop;

    }
  };

  
  useEffect(() => {
    if (!containerRef.current) return;
    if (isMessagesLoading) return;

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages.length, isMessagesLoading]);


  

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <GroupChatHeader />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ scrollbarWidth: "thin" }}
      >
        {isMessagesLoading && (
          <div className="text-center py-2 text-sm opacity-70">
            <Loader2/>
          </div>
        )}

        {messages.map((message) => (
            <div
                key={message._id}
                className={`chat ${
                message.senderId._id === authUser._id ? "chat-end" : "chat-start"
                }`}
            >
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="sender profilePic"
                    src={message.senderId.profilePic || "/i.png"}
                />
                </div>
            </div>

            <div className="chat-bubble ">
            <Link to={`/profile/${message.senderId._id}`}>
              <p className="text-sm font-bold text-red-600 underline cursor-pointer">
                {message.senderId.name}
              </p>
            </Link>
            {message?.text && message?.text}
                {message?.image && (
                    <img
                        src={message?.image}
                        alt="Attachment"
                        className="max-w-[200px] rounded-md mb-2"
                    />
                )} 
            </div>
            <time className="text-xs opacity-50">{new Date(message.createdAt).toLocaleTimeString()}</time>
          </div>
        ))}

        {typingUsers?.length>0 && 
        typingUsers.filter((user)=>user._id!==authUser._id)
        .map((user)=>(
          <div
                key={user._id}
                className={`chat chat-start`}
            >
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="sender profilePic"
                    src={user.profilePic || "/i.png"}
                />
                </div>
            </div>

            <div className="chat-bubble ">
            <Link to={`/profile/${user._id}`}>
              <p className="text-sm font-bold text-red-600 underline cursor-pointer">
                {user.name}
              </p>
            </Link>
            <div className="flex items-center gap-1 mt-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-2 h-2 bg-current rounded-full animate-bounce"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '1.4s'
                }}
              />
            ))}
            </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput mode="group" />
    </div>
  );
};

export default ChatContainer;
