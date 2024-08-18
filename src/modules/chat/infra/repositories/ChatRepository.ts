import { Repository, getRepository, Not, In } from "typeorm";
import { Message } from "../typeorm/entities/Message";
import { IChatRepository } from "../../repositories/IChatRepository";
import ICreateChatMessageDTO from "../../dtos/ICreateChatMessageDTO";
import {
  IListUserMessagesParams,
  IMessage,
} from "../../useCases/listChatMessages/types";

class ChatRepository implements IChatRepository {
  private repository: Repository<Message>;

  constructor() {
    this.repository = getRepository(Message);
  }
  async getMessagesCount(friendId: string, userId: string): Promise<number> {
    const count = await this.repository
      .createQueryBuilder("message")
      .where(
        "(message.receiver_id = :userId AND message.sender_id = :friendId) OR (message.receiver_id = :friendId AND message.sender_id = :userId)",
        { userId, friendId }
      )
      .getCount();

    return count;
  }

  async listUserMessages({
    friendId,
    userId,
    page,
    messagesPerPage = 25,
  }: IListUserMessagesParams): Promise<IMessage[]> {
    const skip = page ? (page - 1) * messagesPerPage : 0;

    const messages = await this.repository
      .createQueryBuilder("message")
      .select([
        "message.id as id",
        "message.sender_id as userId",
        "message.content as content",
        "message.created_at as createdAt",
      ])
      .where(
        "(message.receiver_id = :userId AND message.sender_id = :friendId) OR (message.receiver_id = :friendId AND message.sender_id = :userId)",
        { userId, friendId }
      )
      .orderBy("message.created_at", "DESC")
      .skip(skip)
      .take(messagesPerPage)
      .getRawMany();

    return messages.reverse();
  }

  async createMessage({
    content,
    receiverId,
    senderId,
    notificationId,
  }: ICreateChatMessageDTO): Promise<void> {
    const sendership = this.repository.create({
      sender_id: senderId,
      receiver_id: receiverId,
      notification_id: notificationId,
      content,
    });
    await this.repository.save(sendership);
  }
}

export { ChatRepository };
