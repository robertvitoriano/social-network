import { Repository, getRepository, Not, In } from "typeorm";
import ICreateChatMessageDTO from "@modules/chat/dtos/ICreateChatMessageDTO";
import { Message } from "../typeorm/entities/Message";
import { IChatRepository } from "@modules/chat/repositories/IChatRepository";

class ChatRepository implements IChatRepository {
  private repository: Repository<Message>;

  constructor() {
    this.repository = getRepository(Message);
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
