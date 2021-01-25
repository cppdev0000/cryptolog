import { UserController } from './user.controller';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transactions/transactions.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'my-secret-pw',
      database: 'crypto',
      autoLoadModels: true
    }),
    UserModule,
    AuthModule,
    TransactionModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
