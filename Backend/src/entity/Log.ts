import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from "typeorm";
import { Admin } from "./Admin";
// TODO: implement Logs
@Entity("logs")
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  sql_command: string;

  @Column("text")
  type: string;

  @Column("text")
  action: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    type => Admin,
    user => user.logs
  )
  user: Admin;
}
