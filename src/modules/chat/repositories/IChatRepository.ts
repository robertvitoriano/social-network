import ICreateChatMessageDTO from "../dtos/ICreateChatMessageDTO";
import {
  IListUserMessagesParams,
  IMessage,
} from "../useCases/listChatMessages/types";

interface IChatRepository {
  createMessage(data: ICreateChatMessageDTO): Promise<void>;
  listUserMessages(data: IListUserMessagesParams): Promise<IMessage[]>;
  getMessagesCount(friendId: string, userId: string): Promise<number>;
}

export { IChatRepository };
