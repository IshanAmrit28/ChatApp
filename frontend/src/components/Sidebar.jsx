import React, { useEffect } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers, authUser } = useAuthStore();
  const { users, getUsers, isUsersLoading, selectedUser, setSelectedUser } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div
      className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />

          {/* Dropdown */}
          <div className="relative group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />

            <div className="absolute top-full right-0 w-32 p-5 rounded-md bg-[#282142] border border-grey-600 text-grey-100 hidden group-hover:block z-50">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-white"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-grey-500" />
              <p onClick={logout} className="cursor-pointer text-sm hover:text-white">Logout</p>
            </div>
          </div>
        </div>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="search user..."
          />
        </div>
      </div>
      <div className="flex flex-col">
        {isUsersLoading ? (
          <div className="text-center text-sm py-4">Loading users...</div>
        ) : (
          users.map((user, index) => (
            <div
              onClick={() => {
                setSelectedUser(user);
              }}
              key={user._id}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm hover:bg-[#282142]/30 ${
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
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">Offline</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
