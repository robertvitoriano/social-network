import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../repositories/IChatRepository";
import { IListUserMessagesParams, IMessage } from "./types";

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
  }: IListUserMessagesParams): Promise<IMessage[]> {
    const userMessages: IMessage[] = await this.chatRepository.listUserMessages(
      {
        userId,
        friendId,
        page,
      }
    );
    return userMessages;
  }
}
export { ListChatMessagesUseCase };
