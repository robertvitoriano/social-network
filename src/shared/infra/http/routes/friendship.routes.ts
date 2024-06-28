import { Router } from "express";
import { SendFriendShipController } from "@modules/friendships/useCases/sendFriendshipRequest/SendFriendShipRequestController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { SendFriendShipResponseController } from "@modules/friendships/useCases/sendFriendshipResponse/SendFriendShipResponseController";
import { ListUserFriendsController } from "@modules/friendships/useCases/listUserFriends/ListUserFriendsController";
import { ListUserNonFriendsController } from "@modules/friendships/useCases/listUserNonFriends/ListUserNonFriendsController";
const friendshipRoutes = Router();

const sendFrienshipRequestController = new SendFriendShipController();
const sendFrienshipResponseController = new SendFriendShipResponseController();
const listUserFriendsController = new ListUserFriendsController();
const listUserNonFriendsController = new ListUserNonFriendsController();

friendshipRoutes.post(
  "/send",
  ensureAuthenticated,
  sendFrienshipRequestController.handle
);
friendshipRoutes.post(
  "/finish",
  ensureAuthenticated,
  sendFrienshipResponseController.handle
);
friendshipRoutes.get(
  "/",
  ensureAuthenticated,
  listUserFriendsController.handle
);
friendshipRoutes.get(
  "/non-friends",
  ensureAuthenticated,
  listUserNonFriendsController.handle
);
export { friendshipRoutes };
