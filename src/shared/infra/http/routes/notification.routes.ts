import { Router } from "express";
import { ListUserNotificationsController } from "@modules/notifications/useCases/listNotifications/ListNotificationsController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
const listUserNotificationsController = new ListUserNotificationsController();
const notificationRoutes = Router();

notificationRoutes.get(
  "/list-user-notifications",
  ensureAuthenticated,
  listUserNotificationsController.handle
);

export { notificationRoutes };
