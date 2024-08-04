import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

import { SendChatMessageController } from "@modules/chat/useCases/sendChatMessageUseCase/SendChatMessageController";

const sendChatMessageController = new SendChatMessageController();
const chatRouter = Router();

chatRouter.post(
  "/send-message",
  ensureAuthenticated,
  sendChatMessageController.handle
);

export { chatRouter };
