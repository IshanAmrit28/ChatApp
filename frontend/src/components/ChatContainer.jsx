import { useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, X } from "lucide-react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, sendMessage, subscribeToMessages, unsubscribeFromMessages, selectedUser, setSelectedUser } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  
  const scrollEnd = useRef();

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

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
    <div className="h-full flex flex-col relative backdrop-blur-lg">
      {/* -----------header---------------------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-8 h-8 rounded-full object-cover" />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}></span>
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden max-w-7 cursor-pointer rotate-180"
        />

        <img
          src={assets.help_icon}
          alt="help"
          className="max-md:hidden max-w-5"
        />
      </div>
      
      {/* -----------chat messages---------------------- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const fromMe = msg.senderId === authUser._id;
          const profilePic = fromMe ? authUser.profilePic : selectedUser.profilePic;

          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 ${fromMe ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="text-center text-xs flex flex-col items-center gap-1">
                <img
                  src={profilePic || assets.avatar_icon}
                  alt="avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              </div>

              <div className={`flex flex-col max-w-[70%] ${fromMe ? "items-end" : "items-start"}`}>
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
      <img src={assets.logo_icon} alt="logo" className="w-24 opacity-80" />
      <p className="text-xl font-medium text-white">
        Every day deserves a cup of tea
      </p>
      <p className="text-gray-400">Select a conversation from the sidebar to start chatting</p>
    </div>
  );
};

export default ChatContainer;
