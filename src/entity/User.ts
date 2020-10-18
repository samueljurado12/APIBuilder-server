import {
    Entity, Column, OneToMany, PrimaryColumn,
} from 'typeorm';
import { Guid } from 'guid-typescript';
import Project from './Project';

@Entity()
class User {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: Guid;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @OneToMany(() => Project, (project) => project.owner)
    projects: Project[];
}

export default User;
