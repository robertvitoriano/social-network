import { Repository, getRepository, Not, In } from "typeorm";
import ICreateChatMessageDTO from "@modules/chat/dtos/ICreateChatMessageDTO";
import { Message } from "../typeorm/entities/Message";
import { IChatRepository } from "@modules/chat/repositories/IChatRepository";
import {
  IListUserMessagesParams,
  IMessage,
} from "@modules/chat/useCases/listChatMessages/ListChatMessagesUseCase";
import { User } from "@modules/accounts/infra/typeorm/entities/User";

class ChatRepository implements IChatRepository {
  private repository: Repository<Message>;

  constructor() {
    this.repository = getRepository(Message);
  }
  async listUserMessages({
    friendId,
    userId,
  }: IListUserMessagesParams): Promise<IMessage[]> {
    const messages = await this.repository
      .createQueryBuilder("message")
      .select("id,sender_id as userId, content, created_at as createdAt")
      .where(
        "(message.receiver_id = :userId AND message.sender_id = :friendId) OR (message.receiver_id = :friendId AND message.sender_id = :userId)",
        { userId, friendId }
      )
      .orderBy("created_at")
      .getRawMany();

    return messages;
  }

  async createMessage({
    content,
    receiverId,
    senderId,
  }: ICreateChatMessageDTO): Promise<void> {
    const sendership = this.repository.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    });
    await this.repository.save(sendership);
  }
}

export { ChatRepository };
