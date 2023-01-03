import { Request, Response } from "express";
import { client } from "../../prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface IRequest {
  username: string;
  password: string;
}

class AuthenticateUserUseCase {
  async execute({ username, password }: IRequest) {
    
    //Verificar se usuário existe

    const userAlreadyExists = await client.user.findFirst({
      where: {
        username
      }
    });

    if (!userAlreadyExists) {
      throw new Error("User or password incorrect");
    }

    //Verificar se a senha está correta
    
    const passwordMatch = compare(password, userAlreadyExists.password)

    if(!passwordMatch){
      throw new Error("User or password incorrect");
    }

    //Gerar token do usuário

    const token = sign({}, "125d86b5-a459-4560-a781-45ceb150dea5", {
      subject: userAlreadyExists.id,
      expiresIn: "20s"
    })

    return { token }
    
  }
}

export { AuthenticateUserUseCase }