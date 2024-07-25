import { Router } from "express";
import { usersRoutes } from "./users.routes";
import { authenticateRoutes } from "./authenticate.routes";
import { friendshipRoutes } from "./friendship.routes";
import { notificationRoutes } from "./notification.routes";
const router = Router();

router.use("/users", usersRoutes);
router.use(authenticateRoutes);
router.use("/friendships", friendshipRoutes);
router.use("/notifications", notificationRoutes);
export { router };
