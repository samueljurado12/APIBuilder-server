import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import { Project } from "./Project";
import { Guid } from "guid-typescript";


@Entity()
class User {

    @PrimaryColumn({
        type: "varchar"
    })
    id: Guid;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @OneToMany(type => Project, project => project.owner)
    projects: Project[];

}

export default User;
