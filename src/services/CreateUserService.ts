import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/users';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const UsersRepository = getRepository(User);

    const CheckUserExists = await UsersRepository.findOne({
      where: { email },
    });

    if (CheckUserExists) {
      throw new Error('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = UsersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await UsersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
