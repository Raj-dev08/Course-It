import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupChatStore } from "../store/useGroupChat";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = ({mode}) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage ,isSendingMessages, selectedUser} = useChatStore();
  const { sendMessages,isSendingMessage , selectedGroup} = useGroupChatStore();
  const { socket,authUser, checkAuth }=useAuthStore();

  const typingTimeoutRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      if (mode === "chat") {
        await sendMessage({ text, image: imagePreview });
      } else if (mode === "group") {
        await sendMessages({ text, image: imagePreview });
      }

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };


  const sendToggle=()=>{

    if (!isTyping) {
      setIsTyping(true);
      if(mode==="chat"){
        socket.emit("typingToUser",{from:authUser._id,to:selectedUser._id});
      }
      if(mode==="group"){
        socket.emit("typing",{from:authUser,to:selectedGroup._id});
      }
      
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if(mode==="chat"){
        socket.emit("stopTypingToUser",{to:selectedUser._id});
      }
      if(mode==="group"){
        socket.emit("stopTyping",{from:authUser,to:selectedGroup._id});
      }
    }, 2000); 
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              sendToggle()
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview && isSendingMessage||
            !text.trim() && !imagePreview && isSendingMessages||
            isSendingMessage||
            isSendingMessages|| !text.trim() && !imagePreview
          }
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;