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
    const messagesPerPage = 25;
    const messages: IMessage[] = await this.chatRepository.listUserMessages({
      userId,
      friendId,
      page,
      messagesPerPage,
    });
    const total = await this.chatRepository.getMessagesCount(friendId, userId);
    const totalPages: number = Math.ceil(total / messagesPerPage);
    return { messages, currentPage: page, totalPages };
  }
}
export { ListChatMessagesUseCase };
