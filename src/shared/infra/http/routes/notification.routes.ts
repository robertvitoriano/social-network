import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ListUserNotificationsController } from "../../../../modules/notifications/useCases/listNotifications/ListNotificationsController";
import { ReadNotificationsController } from "../../../../modules/notifications/useCases/readNotifications/ReadNotificationsController";
const listUserNotificationsController = new ListUserNotificationsController();
const readNotificationsController = new ReadNotificationsController();
const notificationRoutes = Router();

notificationRoutes.get(
  "/list-user-notifications",
  ensureAuthenticated,
  listUserNotificationsController.handle
);
notificationRoutes.patch(
  "/read",
  ensureAuthenticated,
  readNotificationsController.handle
);

export { notificationRoutes };
