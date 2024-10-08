import { Router } from "express";
import { usersRoutes } from "./users.routes";
import { friendshipRoutes } from "./friendship.routes";
import { notificationRoutes } from "./notification.routes";
import { authenticateRoutes } from "./authenticate.routes";
import { chatRouter } from "./chat.routes";
import { feedRouter } from "./feed.routes";
const router = Router();

router.use(authenticateRoutes);
router.use("/friendships", friendshipRoutes);
router.use("/notifications", notificationRoutes);
router.use("/users", usersRoutes);
router.use("/chat", chatRouter);
router.use("/feed", feedRouter);

export { router };
