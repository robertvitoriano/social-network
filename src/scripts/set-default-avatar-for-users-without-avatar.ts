import "reflect-metadata";
import { UserRepository } from "src/modules/accounts/infra/repositories/UsersRepository";
import { ListUsersUseCase } from "src/modules/accounts/useCases/ListUsers/ListUsersUseCase";
import { UpdateUserUseCase } from "src/modules/accounts/useCases/UpdateUser/UpdateUserUseCase";
import { DatabaseConnection } from "src/shared/infra/typeorm/DatabaseConnection";

async function setDefaultAvatarForUsersWithoutAvatar() {}
const db = new DatabaseConnection();
db.connect().then(async () => {
  await setDefaultAvatarForUsersWithoutAvatar().then(async () => {
    const listUsersUseCase = new ListUsersUseCase(new UserRepository());
    const updateUserUseCase = new UpdateUserUseCase(new UserRepository());
    
    const users = await listUsersUseCase.execute();
    const totalUsers = users.length;
    let index = 1;

    for (const user of users) {
      const responseResult = await fetch(user.avatar);
      if (responseResult.status == 404) {
        console.log(` User being updated ${index} name: ${user.name}`);
        await updateUserUseCase.execute({
          user_id: user.id,
          updateData: {
            avatarUrl:
              '',
          },
        });
        console.log(`Updated Users ${index}/${totalUsers}`);
        index++;
      }
    }
    console.log("Avatars updated");
  });
});
