import { TransactionSeeds } from "src/seeding/seed.transactions";
import { UserSeeds } from "src/seeding/seed.users";
import { getRepository, MigrationInterface, QueryRunner } from "typeorm";

export class Initial1612324650331 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<void> {
    //await getRepository("Users").save(UserSeeds);
    //await getRepository("Transactions").save(TransactionSeeds);
  }

  public async down(_: QueryRunner): Promise<void> {
  }
}
