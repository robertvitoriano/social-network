import { Router } from "express";
import { UpdateUserController } from "../../../../modules/accounts/useCases/UpdateUser/UpdateUserController";
import { CreateUserController } from "../../../../modules/accounts/useCases/createUser/CreateUserController";
import uploadConfig from "../../../../config/upload";
import multer from "multer";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { GetUserProfileController } from "src/modules/accounts/useCases/getUserProfile/GetUserProfileController";

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig.upload("./tmp/avatar"));

const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const getUserProfileController = new GetUserProfileController();
usersRoutes.post("/", createUserController.handle);
usersRoutes.get("/:userId", getUserProfileController.handle);

usersRoutes.patch(
  "/",
  ensureAuthenticated,
  uploadAvatar.single("avatar"),
  updateUserController.handle
);

export { usersRoutes };
