import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from "typeorm";
import {IsUniq} from "@join-com/typeorm-class-validator-is-uniq/lib";

@Entity("heros")
@Unique(["image"])
export class Hero {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    @IsUniq({scope: ["image"]})
    image: string;

    @Column({nullable: true, default: null})
    alternative: string;

    @Column({nullable: true, default: null})
    title: string;

    @Column()
    content: string;

    @Column()
    link: string;

    @Column({
        default: 'en'
    })
    lang: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
