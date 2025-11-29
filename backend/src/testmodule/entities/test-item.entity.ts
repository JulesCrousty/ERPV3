import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('test_items')
export class TestItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}
