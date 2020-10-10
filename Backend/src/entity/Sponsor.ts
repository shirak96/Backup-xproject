import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from "typeorm";
import {IsUniq} from "@join-com/typeorm-class-validator-is-uniq/lib";

@Entity("sponsors")
@Unique(["image"])
export class Sponsor {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    @IsUniq({scope: ["image"]})
    image: string;

    @Column({nullable: true, default: null})
    image_alternative: string;

    @Column({nullable: true, default: null})
    image_title: string;


    @Column()
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
