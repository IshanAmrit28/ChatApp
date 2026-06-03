import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, sendMessage, deleteMessage, deleteChat } from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/:id", protectRoute, deleteMessage);
router.delete("/chat/:id", protectRoute, deleteChat);

export default router;
