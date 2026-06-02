import React, { useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import assets from "../assets/assets";
import { UserPlus } from "lucide-react";

const DiscoverContainer = () => {
  const { discoverUsers, fetchDiscoverUsers, isDiscoverLoading, sendFriendRequest } = useFriendStore();

  useEffect(() => {
    fetchDiscoverUsers();
  }, [fetchDiscoverUsers]);

  if (isDiscoverLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-[#8185b2]/10 backdrop-blur-lg">
        <p className="text-gray-400">Loading discover...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#8185b2]/10 backdrop-blur-lg">
      <div className="p-6 border-b border-gray-600/50">
        <h1 className="text-2xl font-semibold text-white">Discover</h1>
        <p className="text-gray-400 text-sm mt-1">Find new people to chat with.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {discoverUsers.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No new users to discover right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {discoverUsers.map((user) => (
              <div key={user._id} className="bg-[#282142]/50 border border-gray-600/50 rounded-xl p-4 flex flex-col items-center hover:bg-[#282142] transition-colors">
                <img
                  src={user.profilePic || assets.avatar_icon}
                  alt={user.fullName}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <h3 className="text-white font-medium truncate w-full text-center">{user.fullName}</h3>
                <p className="text-gray-400 text-xs text-center line-clamp-2 mt-1 min-h-[32px]">
                  {user.bio || "No bio available."}
                </p>
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} />
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverContainer;
