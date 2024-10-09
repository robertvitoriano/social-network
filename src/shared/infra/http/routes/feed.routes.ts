import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { CreatePostController } from "../../../../modules/feed/useCases/createPost/CreatePostController";
import { ListUserFeedPostsController } from "../../../../modules/feed/useCases/listUserPosts/ListUserFeedPostsController";
import { ToggleLikeController } from "../../../../modules/feed/useCases/toggleLike/TogglePostLikeController";
import { CreateCommentController } from "../../../../modules/feed/useCases/createComment/CreateCommentController";
import { ListCommentController } from "../../../../modules/feed/useCases/listComments/ListCommentsController";
import { GetPostController } from "../../../../modules/feed/useCases/getPost/GetPostController";
import { ListFeedPostsController } from "../../../../modules/feed/useCases/listFeedPosts/ListFeedPostsController";
const createPostController = new CreatePostController();
const listUserFeedPostsController = new ListUserFeedPostsController();
const toggleLikeController = new ToggleLikeController();
const createCommentController = new CreateCommentController();
const listCommentsController = new ListCommentController();
const getPostController = new GetPostController();
const listFeedPostsController = new ListFeedPostsController();
const feedRouter = Router();

feedRouter.post("/", ensureAuthenticated, createPostController.handle);
feedRouter.post("/likes", ensureAuthenticated, toggleLikeController.handle);

feedRouter.get(
  "/comments/:postId",
  ensureAuthenticated,
  listCommentsController.handle
);
feedRouter.get("/post/:postId", ensureAuthenticated, getPostController.handle);
feedRouter.get("/timeline/:userId", listUserFeedPostsController.handle);
feedRouter.get("/:userId", ensureAuthenticated, listFeedPostsController.handle);
feedRouter.post(
  "/comments",
  ensureAuthenticated,
  createCommentController.handle
);
export { feedRouter };
