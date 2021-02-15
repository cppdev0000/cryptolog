import { UserSeeds } from './seed.users';
import { TransactionModel } from './../transactions/transaction.model';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SeedingModel } from './seeding.model';
import { UserModel } from 'src/users/user.model';

@Injectable()
export class SeedingMiddleware implements NestMiddleware {
  private isSeedingComplete: Promise<boolean>;

  constructor(private readonly entityManager: EntityManager) {}

  async use(req: any, res: any, next: () => void) {
    if (await this.isSeedingComplete) {
      // seeding has already taken place,
      // we can short-circuit to the next middleware
      return next();
    }

    this.isSeedingComplete = (async () => {
      if (!await this.entityManager.findOne(SeedingModel, { id: 'initial-seeding' })) {
        await this.entityManager.transaction(async transactionalEntityManager => {
          await transactionalEntityManager.save(UserModel, UserSeeds);
          await transactionalEntityManager.save(TransactionModel, UserSeeds);
          await transactionalEntityManager.save(new SeedingModel('initial-seeding'));
        });
      }

      return true;
    })();

    next();
  }
}
