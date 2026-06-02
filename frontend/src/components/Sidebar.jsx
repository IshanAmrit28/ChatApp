import React, { useEffect } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { LogOut, MessageCircle, Compass, Bell } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers, authUser } = useAuthStore();
  const { selectedUser, setSelectedUser } = useChatStore();
  const { friends, fetchFriends, isFriendsLoading, activeTab, setActiveTab, requests } = useFriendStore();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div
      className={`bg-[#8185b2]/10 h-full p-5 flex flex-col overflow-hidden text-white border-r border-gray-600/50 ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5 shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle size={28} className="text-violet-500" />
            <span className="text-xl font-bold tracking-wider">Vibe</span>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#282142]/50 rounded-lg p-1 mb-5">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 flex justify-center items-center py-2 rounded-md transition-colors ${activeTab === "chats" ? "bg-[#282142] text-white shadow-sm" : "text-gray-400 hover:text-gray-200"}`}
          >
            <MessageCircle size={18} />
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex-1 flex justify-center items-center py-2 rounded-md transition-colors ${activeTab === "discover" ? "bg-[#282142] text-white shadow-sm" : "text-gray-400 hover:text-gray-200"}`}
          >
            <Compass size={18} />
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 flex justify-center items-center py-2 rounded-md transition-colors relative ${activeTab === "requests" ? "bg-[#282142] text-white shadow-sm" : "text-gray-400 hover:text-gray-200"}`}
          >
            <Bell size={18} />
            {requests.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {activeTab === "chats" && (
          <div className="bg-[#282142] border border-gray-600/50 rounded-full flex items-center gap-2 py-3 px-4">
            <img src={assets.search_icon} alt="search" className="w-3 opacity-50" />
            <input
              type="text"
              className="bg-transparent border-none outline-none text-white text-xs placeholder-gray-500 flex-1"
              placeholder="search friends..."
            />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pr-2">
        {activeTab !== "chats" ? null : isFriendsLoading ? (
          <div className="text-center text-sm py-4 text-gray-400">Loading friends...</div>
        ) : friends.length === 0 ? (
          <div className="text-center text-sm py-8 text-gray-400">No friends yet. Go to Discover to find some!</div>
        ) : (
          friends.map((user) => (
            <div
              onClick={() => {
                setSelectedUser(user);
              }}
              key={user._id}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded-lg cursor-pointer max-sm:text-sm hover:bg-[#282142]/30 transition-colors ${
                selectedUser?._id === user._id && "bg-[#282142]/50"
              }`}
            >
              <div className="relative">
                <img
                  src={user.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-[35px] aspect-square rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#282142]"></span>
                )}
              </div>
              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-500 text-xs font-medium">Online</span>
                ) : (
                  <span className="text-gray-400 text-xs">Offline</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Current User & Logout */}
      <div className="pt-4 mt-2 border-t border-gray-600/50 shrink-0 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group flex-1 overflow-hidden" 
          onClick={() => navigate("/profile")}
        >
          <img 
            src={authUser?.profilePic || assets.avatar_icon} 
            className="w-10 h-10 rounded-full object-cover border border-gray-600" 
          />
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-medium truncate group-hover:text-violet-400 transition-colors">{authUser?.fullName}</p>
            <p className="text-xs text-gray-400">Edit Profile</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors text-gray-400 hover:text-white"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
