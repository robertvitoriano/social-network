import { Router } from "express";
import { UpdateUserController } from "../../../../modules/accounts/useCases/UpdateUser/UpdateUserController";
import { CreateUserController } from "../../../../modules/accounts/useCases/createUser/CreateUserController";
import uploadConfig from "../../../../config/upload";
import multer from "multer";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { GetUserProfileController } from "../../../../modules/accounts/useCases/getUserProfile/GetUserProfileController";

const usersRoutes = Router();

const upload = multer(uploadConfig.upload("./tmp/"));

const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const getUserProfileController = new GetUserProfileController();
usersRoutes.post("/", createUserController.handle);
usersRoutes.get("/:userId", getUserProfileController.handle);

usersRoutes.patch(
  "/",
  ensureAuthenticated,
  upload.fields([{ name: "avatar" }, { name: "cover" }]),
  updateUserController.handle
);

export { usersRoutes };
