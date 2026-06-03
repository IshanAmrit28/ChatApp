import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const me = await User.findById(myId);
    if (!me.friends.includes(userToChatId)) {
      return res.status(403).json({ message: "You can only view messages with friends" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      deletedBy: { $ne: myId },
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const me = await User.findById(senderId);
    if (!me.friends.includes(receiverId)) {
      return res.status(403).json({ message: "You can only send messages to friends" });
    }

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'me' or 'everyone'
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (type === "everyone") {
      if (message.senderId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You can only delete your own messages for everyone" });
      }
      
      message.isDeleted = true;
      message.text = "This message was deleted";
      message.image = null;
      await message.save();

      const receiverSocketId = getReceiverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", message);
      }

      return res.status(200).json(message);
    } else if (type === "me") {
      if (!message.deletedBy.includes(userId)) {
        message.deletedBy.push(userId);
        await message.save();
      }
      return res.status(200).json(message);
    } else {
      return res.status(400).json({ message: "Invalid delete type" });
    }
  } catch (error) {
    console.log("Error in deleteMessage controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    await Message.updateMany(
      {
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
        deletedBy: { $ne: myId }
      },
      {
        $push: { deletedBy: myId }
      }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.log("Error in deleteChat controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
