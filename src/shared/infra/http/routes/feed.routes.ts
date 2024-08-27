import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CreatePostController } from "src/modules/feed/useCases/createPost/CreatePostController";
import { ListUserFeedPostsController } from "src/modules/feed/useCases/listUserPosts/ListUserFeedPostsController";

const createPostController = new CreatePostController();
const listUserFeedPostsController = new ListUserFeedPostsController();
const feedRouter = Router();

feedRouter.post("/", ensureAuthenticated, createPostController.handle);
feedRouter.get(
  "/:userId",
  ensureAuthenticated,
  listUserFeedPostsController.handle
);
export { feedRouter };
