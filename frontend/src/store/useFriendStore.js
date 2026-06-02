import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useFriendStore = create((set, get) => ({
  friends: [],
  discoverUsers: [],
  requests: [],
  activeTab: "chats", // 'chats', 'discover', 'requests'
  isFriendsLoading: false,
  isDiscoverLoading: false,
  isRequestsLoading: false,

  fetchFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const res = await axiosInstance.get("/users/friends");
      set({ friends: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch friends");
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  fetchDiscoverUsers: async () => {
    set({ isDiscoverLoading: true });
    try {
      const res = await axiosInstance.get("/users/discover");
      set({ discoverUsers: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch discover users");
    } finally {
      set({ isDiscoverLoading: false });
    }
  },

  fetchRequests: async () => {
    set({ isRequestsLoading: true });
    try {
      const res = await axiosInstance.get("/users/requests");
      set({ requests: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      await axiosInstance.post(`/users/request/${userId}`);
      set({ discoverUsers: get().discoverUsers.filter((u) => u._id !== userId) });
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  acceptFriendRequest: async (userId) => {
    try {
      const res = await axiosInstance.post(`/users/accept/${userId}`);
      set({
        requests: get().requests.filter((u) => u._id !== userId),
        friends: [...get().friends, res.data],
      });
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  },

  rejectFriendRequest: async (userId) => {
    try {
      await axiosInstance.post(`/users/reject/${userId}`);
      set({ requests: get().requests.filter((u) => u._id !== userId) });
      toast.success("Friend request rejected");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
}));
