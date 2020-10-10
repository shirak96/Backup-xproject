import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { Length, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Log } from "./Log";
import { IsUniq } from "@join-com/typeorm-class-validator-is-uniq";

@Entity("admins")
@Unique(["username", "email"])
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  full_name: string;


  @Column()
  @IsUniq({ scope: ["username"] })
  username: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column()
  @IsEmail()
  @IsUniq({ scope: ["email"] })
  email: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    type => Log,
    log => log.user
  )
  logs: Log[];

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
