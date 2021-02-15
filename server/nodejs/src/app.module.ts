import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { TransactionModule } from './transactions/transactions.module';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './users/user.model';
import { TransactionModel } from './transactions/transaction.model';
import { SeedingModule } from './seeding/seeding.module';
import { SeedingModel } from './seeding/seeding.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'my-secret-pw',
      database: 'crypto2',
      // insecureAuth: true,
      entities: [ UserModel, TransactionModel, SeedingModel ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    TransactionModule,
    SeedingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
