import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getFriends,
  getDiscoverUsers,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/friends", protectRoute, getFriends);
router.get("/discover", protectRoute, getDiscoverUsers);
router.get("/requests", protectRoute, getFriendRequests);

router.post("/request/:id", protectRoute, sendFriendRequest);
router.post("/accept/:id", protectRoute, acceptFriendRequest);
router.post("/reject/:id", protectRoute, rejectFriendRequest);

export default router;
