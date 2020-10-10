import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn,} from "typeorm";
import {IsUniq} from "@join-com/typeorm-class-validator-is-uniq/lib";

@Entity("settings")
@Unique(["key"])
export class Setting {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    @IsUniq({scope: ["key"]})
    key: string;

    @Column()
    value: string;

    @Column({
        default: ''
    })
    label: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}
