import { Router } from "express";
import { SendFriendShipController } from "@modules/friendships/useCases/sendFriendshipRequest/SendFriendShipRequestController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { SendFriendShipResponseController } from "@modules/friendships/useCases/sendFriendshipResponse/SendFriendShipResponseController";
import { ListUserFriendsController } from "@modules/friendships/useCases/listUserFriends/ListUserFriendsController";
const usersRoutes = Router();

const sendFrienshipRequestController = new SendFriendShipController();
const sendFrienshipResponseController = new SendFriendShipResponseController();
const listUserFriendsController = new ListUserFriendsController();
usersRoutes.post(
  "/friendships/send",
  ensureAuthenticated,
  sendFrienshipRequestController.handle
);
usersRoutes.post(
  "/friendships/finish",
  ensureAuthenticated,
  sendFrienshipResponseController.handle
);
usersRoutes.get(
  "/friendships",
  ensureAuthenticated,
  listUserFriendsController.handle
);
export { usersRoutes };
