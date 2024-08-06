import ICreateChatMessageDTO from "../dtos/ICreateChatMessageDTO";
import {
  IListUserMessagesParams,
  IMessage,
} from "../useCases/listChatMessages/ListChatMessagesUseCase";

interface IChatRepository {
  createMessage(data: ICreateChatMessageDTO): Promise<void>;
  listUserMessages(data: IListUserMessagesParams): Promise<IMessage[]>;
}

export { IChatRepository };
