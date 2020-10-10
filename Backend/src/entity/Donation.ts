import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne, Unique
} from "typeorm";
import {User} from './User'
import {IsUniq} from "@join-com/typeorm-class-validator-is-uniq/lib";
import {IsIn, IsNotEmpty} from "class-validator";

@Entity("donations")
@Unique(["transaction_id"])
export class Donation {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    @IsUniq({scope: ["transaction_id"]})
    transaction_id: string;

    @Column()
    @IsIn(["stripe", "paypal", 'bitcoin'])
    @IsNotEmpty()
    type: string;

    @Column({ default: null, nullable: true })
    about: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(
        type => User,
        user => user.donations
    )
    user: User;
}
