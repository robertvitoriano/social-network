import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CreatePostController } from "../../../../modules/feed/useCases/createPost/CreatePostController";
import { ListUserFeedPostsController } from "../../../../modules/feed/useCases/listUserPosts/ListUserFeedPostsController";
import { ToggleLikeController } from "../../../../modules/feed/useCases/toggleLike/ToggleLikeController";

const createPostController = new CreatePostController();
const listUserFeedPostsController = new ListUserFeedPostsController();
const toggleLikeController = new ToggleLikeController();
const feedRouter = Router();

feedRouter.post("/", ensureAuthenticated, createPostController.handle);
feedRouter.post("/likes", ensureAuthenticated, toggleLikeController.handle);

feedRouter.get(
  "/:userId",
  ensureAuthenticated,
  listUserFeedPostsController.handle
);
export { feedRouter };
