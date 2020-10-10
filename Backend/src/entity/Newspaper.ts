import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique
} from "typeorm";
import {IsUniq} from "@join-com/typeorm-class-validator-is-uniq/lib";

@Entity("newspapers")
@Unique(["image"])
export class Newspaper {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    @IsUniq({scope: ["image"]})
    image: string;

    @Column({ nullable: true, default: null})
    alternative: string;

    @Column({ nullable: true, default: null})
    title: string;

    // @Column({
    //     default: 'en'
    // })
    // lang: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
