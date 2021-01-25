import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  exports: [UserService],
  controllers: [],
  providers: [UserService]
})
export class UserModule {}
