import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  showRightSide: true,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  deleteMessage: async (messageId, type) => {
    try {
      const res = await axiosInstance.delete(`/messages/${messageId}`, { data: { type } });
      const deletedMessage = res.data;
      
      const messages = get().messages;
      if (type === 'me') {
        set({ messages: messages.filter(msg => msg._id !== messageId) });
      } else {
        set({ messages: messages.map(msg => msg._id === messageId ? deletedMessage : msg) });
      }
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  clearChatImmediately: async (userId) => {
    try {
      await axiosInstance.delete(`/messages/chat/${userId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete chat");
      throw error;
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    socket.on("messageDeleted", (deletedMessage) => {
      const isMessageForSelectedUser = 
        deletedMessage.senderId === selectedUser._id || deletedMessage.receiverId === selectedUser._id;
      if (!isMessageForSelectedUser) return;

      set({
        messages: get().messages.map(msg => msg._id === deletedMessage._id ? deletedMessage : msg),
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("messageDeleted");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, showRightSide: false }),
  setShowRightSide: (showRightSide) => set({ showRightSide }),
}));
