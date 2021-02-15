import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('Seeding')
export class SeedingModel {
  @PrimaryColumn()
  public id: string;

  @CreateDateColumn()
  creationDate: Date;

  constructor(id?: string) {
    this.id = id;
  }
}
