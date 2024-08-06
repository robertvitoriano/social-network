import { inject, injectable } from "tsyringe";
import { IChatRepository } from "../../repositories/IChatRepository";
import { AppError } from "@shared/errors/AppError";
import { IUserFriendDTO } from "@modules/friendships/dtos/IUserFriendDTO";
export type IListUserMessagesParams = {
  friendId: string;
  userId: string;
};
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
  }: IListUserMessagesParams): Promise<IMessage[]> {
    const userMessages: IMessage[] = await this.chatRepository.listUserMessages(
      {
        userId,
        friendId,
      }
    );
    return userMessages;
  }
}
export { ListChatMessagesUseCase };
