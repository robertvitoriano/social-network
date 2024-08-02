import { Router } from "express";
import { usersRoutes } from "./users.routes";
import { friendshipRoutes } from "./friendship.routes";
import { notificationRoutes } from "./notification.routes";
import { authenticateRoutes } from "./authenticate.routes";
const router = Router();

router.use(authenticateRoutes);
router.use("/friendships", friendshipRoutes);
router.use("/notifications", notificationRoutes);
router.use("/users", usersRoutes);
export { router };
