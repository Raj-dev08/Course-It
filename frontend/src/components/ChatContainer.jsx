import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { Loader2 ,CheckCheck} from "lucide-react";
import { Link } from "react-router-dom";


const SCROLL_THRESHOLD = 100;

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    hasMoreMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    refreshMessages,
    setTypingIndicator,
    typingUsers
  } = useChatStore();

  const containerRef = useRef(null);
  const limit=10;

  // console.log(selectedUser)

  // console.log(typingUsers)

  useEffect(() => {
    if (!selectedUser) return;
    refreshMessages();
    getMessages(selectedUser._id, limit,Date.now());
    subscribeToMessages();
    setTypingIndicator();
  }, [selectedUser,getMessages,subscribeToMessages,setTypingIndicator]);


  const handleScroll = async () => {
    if (!containerRef.current) return;
    if (isMessagesLoading) return; 

    const scrollTop = containerRef.current.scrollTop;

    if (scrollTop < SCROLL_THRESHOLD && hasMoreMessages) {

    
      const oldestMessage = messages[0];
      const before = oldestMessage?.createdAt;

      
      const oldScrollHeight = containerRef.current.scrollHeight;

      await getMessages(selectedUser._id, limit, before);

      
      const newScrollHeight = containerRef.current.scrollHeight;

      containerRef.current.scrollTop = newScrollHeight - oldScrollHeight + scrollTop;

    }
  };

  
  useEffect(() => {
    if (!containerRef.current) return;
    if (isMessagesLoading) return;

    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, isMessagesLoading]);

  

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />

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
              message.senderId === selectedUser._id ? "chat-start" : "chat-end"
            }`}
          >
            <div className="chat-bubble ">{message.text&&message.text}
                {message.image&&(
                    <img 
                        src={message.image}
                        alt="Attachment"
                        className="max-w-[200px] rounded-md mb-2"
                    />
                )} 
                {message.isSeen?
                (<CheckCheck className="text-blue-600 size-6"/>)
                :(<CheckCheck className="text-gray-600 size-6"/>)}
            </div>
            <time className="text-xs opacity-50 ml-1">{new Date(message.createdAt).toLocaleTimeString()}</time>
          </div>
        ))}

         {typingUsers.length>0 && 
         
          <div
                key={selectedUser._id}
                className={`chat chat-start`}
            >
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="sender profilePic"
                    src={selectedUser.profilePic || "/i.png"}
                />
                </div>
            </div>

            <div className="chat-bubble ">
            <Link to={`/profile/${selectedUser._id}`}>
              <p className="text-sm font-bold text-red-600 underline cursor-pointer">
                {selectedUser.name}
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
        }
      </div>

      <MessageInput mode="chat" />
    </div>
  );
};

export default ChatContainer;
