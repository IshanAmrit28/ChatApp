import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";

// Get only friends for the sidebar
export const getFriends = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const user = await User.findById(loggedInUserId).populate("friends", "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getFriends: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Discover non-friends (excluding self and already requested)
export const getDiscoverUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude self, existing friends, sent requests, and received requests
    const excludedIds = [
      loggedInUserId,
      ...user.friends,
      ...user.sentRequests,
      ...user.receivedRequests,
    ];

    const discoverUsers = await User.find({ _id: { $nin: excludedIds } })
      .select("-password")
      .limit(50); // Limit discover to 50 random users for now

    res.status(200).json(discoverUsers);
  } catch (error) {
    console.error("Error in getDiscoverUsers: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get incoming friend requests
export const getFriendRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const user = await User.findById(loggedInUserId).populate("receivedRequests", "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.receivedRequests);
  } catch (error) {
    console.error("Error in getFriendRequests: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    if (sender.sentRequests.includes(receiverId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    if (sender.receivedRequests.includes(receiverId)) {
      return res.status(400).json({ message: "You already have a request from this user" });
    }

    // Update both users
    sender.sentRequests.push(receiverId);
    receiver.receivedRequests.push(senderId);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error in sendFriendRequest: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: senderId } = req.params;

    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.receivedRequests.includes(senderId)) {
      return res.status(400).json({ message: "No friend request from this user" });
    }

    // Remove from requests arrays
    user.receivedRequests = user.receivedRequests.filter((id) => id.toString() !== senderId.toString());
    sender.sentRequests = sender.sentRequests.filter((id) => id.toString() !== userId.toString());

    // Add to friends arrays
    user.friends.push(senderId);
    sender.friends.push(userId);

    await user.save();
    await sender.save();

    res.status(200).json(sender); // Return the newly added friend
  } catch (error) {
    console.error("Error in acceptFriendRequest: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reject a friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: senderId } = req.params;

    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.receivedRequests.includes(senderId)) {
      return res.status(400).json({ message: "No friend request from this user" });
    }

    // Remove from requests arrays
    user.receivedRequests = user.receivedRequests.filter((id) => id.toString() !== senderId.toString());
    sender.sentRequests = sender.sentRequests.filter((id) => id.toString() !== userId.toString());

    await user.save();
    await sender.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error in rejectFriendRequest: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --- AUTHENTICATION CONTROLLERS RESTORED ---

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        friends: newUser.friends,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      friends: user.friends,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
