import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, Unique,
} from "typeorm";
import {IsUniq} from "@join-com/typeorm-class-validator-is-uniq/lib";

@Entity("instagram_galleries")
@Unique(["insta_id"])
export class InstagramGalleries {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    @IsUniq({ scope: ["insta_id"] })
    insta_id: string;

    @Column()
    media_type: string;

    @Column()
    media_url: string;

    @Column()
    permalink: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
