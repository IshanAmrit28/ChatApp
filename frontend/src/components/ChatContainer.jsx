import { useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, X, Trash2, MessageCircle, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, sendMessage, subscribeToMessages, unsubscribeFromMessages, selectedUser, setSelectedUser, deleteMessage, showRightSide, setShowRightSide, clearChatImmediately } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  
  const scrollEnd = useRef();

  const handleDeleteChat = () => {
    const backupMessages = [...messages];
    useChatStore.setState({ messages: [] });
    let isUndone = false;
    
    toast((t) => (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Chat deleted</span>
        <button
          className="px-3 py-1 bg-violet-600 text-white rounded-md text-sm hover:bg-violet-700 transition-colors"
          onClick={() => {
            isUndone = true;
            useChatStore.setState({ messages: backupMessages });
            toast.dismiss(t.id);
          }}
        >
          Undo
        </button>
      </div>
    ), { duration: 5000, id: "delete-chat-toast" });
    
    setTimeout(async () => {
      if (!isUndone) {
        try {
          await clearChatImmediately(selectedUser._id);
        } catch (error) {
          useChatStore.setState({ messages: backupMessages });
        }
      }
    }, 5000);
  };

  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-full">
        <p className="text-white">Loading messages...</p>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser?._id);

  return selectedUser ? (
    <div className="h-full flex flex-col relative backdrop-blur-lg overflow-hidden">
      {/* -----------header---------------------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setShowRightSide(true)}
        >
          <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full object-cover" />
          <p className="text-lg text-white flex items-center gap-2">
            {selectedUser.fullName}
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}></span>
          </p>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative group/headermenu cursor-pointer p-1">
            <MoreVertical 
              size={20} 
              className="text-gray-400 hover:text-white transition-colors" 
            />
            <div className="absolute right-0 top-full pt-2 hidden group-hover/headermenu:block z-50">
              <div className="flex flex-col bg-[#282142] p-2 rounded-lg shadow-lg shadow-black/50 text-sm w-36 border border-gray-600">
                <button onClick={handleDeleteChat} className="text-left p-2 hover:bg-gray-700 rounded transition-colors w-full text-red-400 flex items-center gap-2">
                  <Trash2 size={16} />
                  Clear chat
                </button>
                <button onClick={() => setSelectedUser(null)} className="text-left p-2 hover:bg-gray-700 rounded transition-colors w-full text-white flex items-center gap-2">
                  <X size={16} />
                  Close chat
                </button>
              </div>
            </div>
          </div>
          
          <img
            onClick={() => setSelectedUser(null)}
            src={assets.arrow_icon}
            alt="back"
            className="md:hidden w-7 h-7 cursor-pointer rotate-180"
          />
        </div>
      </div>
      
      {/* -----------chat messages---------------------- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const fromMe = msg.senderId === authUser._id;
          const profilePic = fromMe ? authUser.profilePic : selectedUser.profilePic;

          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 ${fromMe ? "flex-row-reverse" : "flex-row"} group relative`}
            >
              <div className="text-center text-xs flex flex-col items-center gap-1 shrink-0">
                <img
                  src={profilePic || assets.avatar_icon}
                  alt="avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              </div>

              <div className={`flex flex-col max-w-[70%] relative ${fromMe ? "items-end" : "items-start"}`}>
                
                {/* Trash menu for deleting */}
                {!msg.isDeleted && (
                  <div className={`absolute top-1/2 -translate-y-1/2 ${fromMe ? "right-[100%] mr-2" : "left-[100%] ml-2"} hidden group-hover:flex items-center`}>
                    <div className="relative group/menu">
                      <Trash2 size={16} className="text-gray-400 hover:text-white cursor-pointer" />
                      <div className={`absolute bottom-full pb-2 ${fromMe ? "right-0" : "left-0"} hidden group-hover/menu:block z-50`}>
                        <div className="flex flex-col bg-[#282142] p-2 rounded-lg shadow-lg shadow-black/50 text-xs w-36 border border-gray-600">
                          <button onClick={() => deleteMessage(msg._id, 'me')} className="text-left p-2 hover:bg-gray-700 rounded transition-colors w-full text-white">Delete for me</button>
                          {fromMe && (
                            <button onClick={() => deleteMessage(msg._id, 'everyone')} className="text-left p-2 hover:bg-gray-700 rounded transition-colors w-full text-red-400">Delete for everyone</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {msg.isDeleted ? (
                  <p className="p-3 rounded-xl text-gray-400 italic bg-gray-800/80 border border-gray-700">
                    This message was deleted
                  </p>
                ) : (
                  <>
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2 object-cover border border-gray-600"
                      />
                    )}
                    {msg.text && (
                      <p
                        className={`p-3 rounded-xl text-white ${
                          fromMe
                            ? "bg-violet-600 rounded-br-sm"
                            : "bg-gray-700 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </p>
                    )}
                  </>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/*------------------------- sending area--------------- */}
      <div className="p-4 border-t border-stone-500 bg-transparent">
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
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center border border-zinc-700"
                type="button"
              >
                <X className="size-3 text-white" />
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-[#282142]/50 px-3 rounded-full border border-gray-600">
            <input
              type="text"
              placeholder="Send a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 text-sm p-3 border-none outline-none text-white bg-transparent"
            />
            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <label htmlFor="image" className="cursor-pointer">
              <Image size={20} className="text-gray-400 hover:text-violet-500 transition-colors" />
            </label>
          </div>
          <button
            type="submit"
            disabled={!text.trim() && !imagePreview}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-violet-600 text-white disabled:opacity-50 hover:bg-violet-700 transition-colors"
          >
            <img src={assets.send_button} alt="send" className="w-5" />
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-grey-500 bg-white/10 max-md:hidden rounded-lg">
      <MessageCircle size={64} className="text-violet-500 mb-2 opacity-80" />
      <p className="text-xl font-medium text-white">
        Every day deserves a cup of tea
      </p>
      <p className="text-gray-400">Select a conversation from the sidebar to start chatting</p>
    </div>
  );
};

export default ChatContainer;
