import React, { useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import assets from "../assets/assets";
import { Check, X, UserCheck } from "lucide-react";

const RequestsContainer = () => {
  const { requests, fetchRequests, isRequestsLoading, acceptFriendRequest, rejectFriendRequest } = useFriendStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (isRequestsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-[#8185b2]/10 backdrop-blur-lg">
        <p className="text-gray-400">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#8185b2]/10 backdrop-blur-lg">
      <div className="p-6 border-b border-gray-600/50">
        <h1 className="text-2xl font-semibold text-white">Friend Requests</h1>
        <p className="text-gray-400 text-sm mt-1">People who want to connect with you.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <UserCheck size={48} className="mb-4 opacity-50" />
            <p>You have no pending friend requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((user) => (
              <div key={user._id} className="bg-[#282142]/50 border border-gray-600/50 rounded-xl p-4 flex items-center justify-between hover:bg-[#282142] transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-white font-medium">{user.fullName}</h3>
                    <p className="text-gray-400 text-xs line-clamp-1">
                      {user.bio || "No bio"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptFriendRequest(user._id)}
                    className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white flex items-center justify-center transition-colors"
                    title="Accept"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(user._id)}
                    className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                    title="Decline"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsContainer;
