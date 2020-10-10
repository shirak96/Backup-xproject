import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm";

@Entity("calendar_event")
export class CalendarEvent {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    x_pos: number;

    @Column()
    y_pos: number;

    @Column({nullable: true})
    imageSrc: String;

    @Column()
    title: String;

    @Column()
    location: String;

    @Column()
    date: String;

    @Column()
    description: String;

    @Column({
        default: 'en'
    })
    lang: string;
}

// const eventStruct = {
//     id: 0,
//     imageSrc: "",
//     title: "",
//     location: "",
//     date: "",
//     description: "",
//     x_pos: 0,
//     y_pos: 0
//   };
