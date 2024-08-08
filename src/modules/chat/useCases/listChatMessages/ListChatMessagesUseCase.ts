import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../repositories/IChatRepository";

export interface IListUserMessagesParams {
  friendId: string;
  userId: string;
  page: number;
}
export type IMessage = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};
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
