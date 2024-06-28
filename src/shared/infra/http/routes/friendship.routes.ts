import { Router } from "express";
import { SendFriendShipController } from "@modules/friendships/useCases/sendFriendshipRequest/SendFriendShipRequestController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { SendFriendShipResponseController } from "@modules/friendships/useCases/sendFriendshipResponse/SendFriendShipResponseController";
import { ListUserFriendsController } from "@modules/friendships/useCases/listUserFriends/ListUserFriendsController";
import { ListUserNonFriendsController } from "@modules/friendships/useCases/listUserNonFriends/ListUserNonFriendsController";
const usersRoutes = Router();

const sendFrienshipRequestController = new SendFriendShipController();
const sendFrienshipResponseController = new SendFriendShipResponseController();
const listUserFriendsController = new ListUserFriendsController();
const listUserNonFriendsController = new ListUserNonFriendsController();
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
usersRoutes.get(
  "/friendships/non-friends",
  ensureAuthenticated,
  listUserNonFriendsController.handle
);
export { usersRoutes };
