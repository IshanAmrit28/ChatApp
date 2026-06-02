import React from "react";
import assets from "../assets/assets";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";

const RightSide = () => {
  const { logout, onlineUsers } = useAuthStore();
  const { selectedUser, messages, setShowRightSide } = useChatStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);
  const sharedImages = messages?.filter(msg => msg.image).map(msg => msg.image) || [];

  return (
    selectedUser && (
      <div
        className={`bg-[#8185b2]/10 text-white w-full relative overflow-hidden flex flex-col border-l border-gray-600/50 ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="flex items-center gap-4 p-4 shrink-0 border-b border-gray-600/50">
          <X size={20} className="cursor-pointer text-gray-400 hover:text-white" onClick={() => setShowRightSide(false)} />
          <h2 className="text-sm font-medium">Contact info</h2>
        </div>

        {/* Profile Section */}
        <div className="pt-6 flex flex-col items-center gap-2 text-xs font-light mx-auto shrink-0">
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

        <hr className="border-[#ffffff50] my-4 w-full shrink-0" />

        {/* Media Section */}
        <div className="px-5 text-xs flex-1 flex flex-col overflow-hidden">
          <p className="shrink-0">Media</p>
          <div className="mt-2 flex-1 overflow-y-auto grid auto-rows-max grid-cols-2 gap-4 opacity-80 pr-2">
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

      </div>
    )
  );
};

export default RightSide;
