import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ListUserFriendsController } from "../../../../modules/friendships/useCases/listUserFriends/ListUserFriendsController";
import { ListUserNonFriendsController } from "../../../../modules/friendships/useCases/listUserNonFriends/ListUserNonFriendsController";
import { SendFriendShipController } from "../../../../modules/friendships/useCases/sendFriendshipRequest/SendFriendShipRequestController";
import { SendFriendShipResponseController } from "../../../../modules/friendships/useCases/sendFriendshipResponse/SendFriendShipResponseController";

const friendshipRoutes = Router();

const sendFrienshipRequestController = new SendFriendShipController();
const sendFrienshipResponseController = new SendFriendShipResponseController();
const listUserFriendsController = new ListUserFriendsController();
const listUserNonFriendsController = new ListUserNonFriendsController();

friendshipRoutes.patch(
  "/send",
  ensureAuthenticated,
  sendFrienshipRequestController.handle
);
friendshipRoutes.patch(
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
