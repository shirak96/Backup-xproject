import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, Unique,
} from "typeorm";
import {IsUniq} from "@join-com/typeorm-class-validator-is-uniq/lib";

@Entity("youtube_videos")
@Unique(["videoId"])
export class YoutubeVideo {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    @IsUniq({scope: ["videoId"]})
    videoId: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    publishedAt: string;

    @Column()
    eventType: string;

    @Column()
    thumbnail: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
