import ICreateChatMessageDTO from "../dtos/ICreateChatMessageDTO";

interface IChatRepository {
  createMessage(data: ICreateChatMessageDTO): Promise<void>;
}

export { IChatRepository };
