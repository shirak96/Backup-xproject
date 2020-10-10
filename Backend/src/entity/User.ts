import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";
import {IsEmail} from "class-validator";
import {Log} from "./Log";
import {Donation} from "./Donation";
import {IsUniq} from "@join-com/typeorm-class-validator-is-uniq";

@Entity("users")
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    full_name: string;

    @Column()
    @IsEmail()
    @IsUniq({scope: ["email"]})
    email: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(
        type => Donation,
        donation => donation.user
    )
    donations: Donation[];
}
