import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("calendar_heroes")
export class CalendarHero {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    x_pos: number;

    @Column()
    y_pos: number;

    @Column({nullable: true})
    imageSrc: String;

    @Column()
    heroName: String;

    @Column()
    website: String;

    @Column()
    description: String;

    @Column({
        default: 'en'
    })
    lang: string;
}

// const heroStruct = {
//     id: 0,
//     imageSrc: "",
//     heroName: "",
//     website: "",
//     description: "",
//     x_pos: 0,
//     y_pos: 0
//   };
