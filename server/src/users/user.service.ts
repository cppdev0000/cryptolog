import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User ) {}

  //**************************************************************************
  async findById(id: number): Promise<User> {
    return this.userRepository.findByPk(id);
  }

  //**************************************************************************
  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email
      }
    });
  }
}
