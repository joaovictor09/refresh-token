import { client } from "../../prisma/client"
import { hash } from "bcryptjs";

interface UserRequest {
  name: string;
  password: string;
  username: string;
}

class CreateUserUseCase {

  async execute({ name, password, username }: UserRequest) {

    // Verificar se usuario existe

    const userAlreadyExistis = await client.user.findFirst({
      where: {
        username
      }
    });

    if(userAlreadyExistis){
      throw new Error("User already exists!")
    }

    //Cadastra o usuario

    const passwordHash = await hash(password, 8)

    const user = await client.user.create({
      data: {
        name,
        username,
        password: passwordHash,
      }
    })

    return user;
  }

}

export { CreateUserUseCase }