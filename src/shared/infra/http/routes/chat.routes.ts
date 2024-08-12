import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ListChatMessagesController } from "../../../../modules/chat/useCases/listChatMessages/ListChatMessagesController";
import { SendChatMessageController } from "../../../../modules/chat/useCases/sendChatMessageUseCase/SendChatMessageController";

const sendChatMessageController = new SendChatMessageController();
const listMessagesController = new ListChatMessagesController();
const chatRouter = Router();

chatRouter.post(
  "/send-message",
  ensureAuthenticated,
  sendChatMessageController.handle
);
chatRouter.get(
  "/list/:friendId",
  ensureAuthenticated,
  listMessagesController.handle
);
export { chatRouter };
