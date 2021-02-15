import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './user.model';


@Injectable()
export class UserService {
  constructor(@InjectRepository(UserModel) private usersRepository: Repository<UserModel>) {}
     
  //**************************************************************************
  findByEmail(email: string): Promise<UserModel> {
    return this.usersRepository.findOne({
      where: 
      { email: email }
    });
  }
  
  //**************************************************************************
  async findTransactions(id: number): Promise<UserModel> {
    return this.usersRepository.findOne(id, {
      relations: ["transactions"]});
  }
}
