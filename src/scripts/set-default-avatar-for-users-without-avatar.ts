import "reflect-metadata"
import "./../shared/container";
import { ListUsersUseCase } from "src/modules/accounts/useCases/ListUsers/ListUsersUseCase";
import { UpdateUserUseCase } from "src/modules/accounts/useCases/UpdateUser/UpdateUserUseCase";
import { DatabaseConnection } from "src/shared/infra/typeorm/DatabaseConnection";
import { container } from "tsyringe";

async function setDefaultAvatarForUsersWithoutAvatar() {}
const db = new DatabaseConnection();
db.connect().then(async () => {
  await setDefaultAvatarForUsersWithoutAvatar().then(async () => {
    const listUsersUseCase = container.resolve(ListUsersUseCase)
    const updateUserUseCase = container.resolve(UpdateUserUseCase);
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
            "https://social-network-local-development.s3.us-east-1.amazonaws.com/user-avatar/avatardefault_92824.png",
          },
        });
        console.log(`Updated Users ${index}/${totalUsers}`);
        index++;
      }
    }
    console.log("Avatars updated");
  });
}).catch(error=>{
  console.error(error);
});
