import prismaClient from '../prisma';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthRequest {
  email: string,
  password: string
}

export default class UsersServices {
  public async AuthUserService({email, password} : AuthRequest) {
    // Verificando se o e-mail existe
    const user = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    })

    if(!user) {
      throw new Error("User/password incorrect")
    }

    // Verificando se a senha está correta
    const passwordMatch = await compare(password, user.password)

    if(!passwordMatch) {
      throw new Error("User/password incorrect")
    }

    // Gerar um token JWT e devolver os dados do usuário
    const token = sign(
      {
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '30d'
      }
    )

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token
    }
  }

  public async CreateUser({name, email, password} : UserRequest) {
    
    // Verificando se preencheu e-mail
    if(!email){
      throw new Error("E-mail incorrect")
    }

    // Verificando se o e-mail está cadastrado na plataforma
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    })

    if(userAlreadyExists){
      throw new Error("User already exists")
    }

    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return user;
  }

  public async DetailUser(user_id : string) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return user;
  }
}