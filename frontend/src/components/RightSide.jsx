import React from "react";
import assets from "../assets/assets";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const RightSide = () => {
  const { logout, onlineUsers } = useAuthStore();
  const { selectedUser, messages } = useChatStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);
  const sharedImages = messages?.filter(msg => msg.image).map(msg => msg.image) || [];

  return (
    selectedUser && (
      <div
        className={`bg-[#8185b2]/10 text-white w-full relative overflow-y-scroll flex flex-col ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        {/* Profile Section */}
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 aspect-square rounded-full object-cover"
          />

          <div className="px-10 mx-auto flex items-center gap-2 text-xl font-medium">
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}></span>
            {selectedUser.fullName}
          </div>

          <p className="px-10 mx-auto text-center">{selectedUser.bio || "No bio provided."}</p>
        </div>

        <hr className="border-[#ffffff50] my-4 w-full" />

        {/* Media Section */}
        <div className="px-5 text-xs flex-1">
          <p>Media</p>
          <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {sharedImages.length > 0 ? sharedImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="" className="h-full w-full rounded-md object-cover" />
              </div>
            )) : <p className="text-gray-400 col-span-2 text-center mt-4">No media shared</p>}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-5 flex justify-center mt-auto">
          <button 
            onClick={logout}
            className="bg-linear-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-10 rounded-full cursor-pointer hover:opacity-90 w-full"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default RightSide;
