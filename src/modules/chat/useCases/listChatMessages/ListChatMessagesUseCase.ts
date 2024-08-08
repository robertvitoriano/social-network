import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../repositories/IChatRepository";
import {
  IListUserMessagesParams,
  IListUserMessagesResult,
  IMessage,
} from "./types";

@injectable()
class ListChatMessagesUseCase {
  constructor(
    @inject("ChatRepository")
    private chatRepository: IChatRepository
  ) {}

  async execute({
    userId,
    friendId,
    page,
  }: IListUserMessagesParams): Promise<IListUserMessagesResult> {
    const messages: IMessage[] = await this.chatRepository.listUserMessages({
      userId,
      friendId,
      page,
    });
    const total = await this.chatRepository.getMessagesCount(friendId, userId);
    const remainingMessages = total - messages.length * page;
    return { messages, total, remaining: remainingMessages };
  }
}
export { ListChatMessagesUseCase };
