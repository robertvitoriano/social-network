import { Router } from "express";
import { UpdateUserAvatarController } from "../../../../modules/accounts/useCases/UpdateUserAvatar/UpdateUserAvatarController";
import { CreateUserController } from "../../../../modules/accounts/useCases/createUser/CreateUserController";
import uploadConfig from "../../../../config/upload";
import multer from "multer";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig.upload("./tmp/avatar"));

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();

usersRoutes.post("/", createUserController.handle);

usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  uploadAvatar.single("avatar"),
  updateUserAvatarController.handle
);

export { usersRoutes };
