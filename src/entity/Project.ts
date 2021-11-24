import {
    Entity, Column, PrimaryColumn, ManyToOne, OneToOne,
} from 'typeorm';
import { Guid } from 'guid-typescript';

import User from './User';
import Schema from './Schema';

export enum ProjectType {
    Relational = 'Relational',
    NonRelational = 'NonRelational'
}

@Entity()
class Project {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: Guid;

    @ManyToOne(() => User, (user) => user.projects, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    owner: User;

    @Column({
        type: 'varchar',
        length: 50,
    })
    name: string;

    @Column({
        type: 'enum',
        enum: ProjectType,
        default: ProjectType.Relational,
    })
    type: ProjectType;

    @OneToOne(() => Schema, (schema) => schema.project, { nullable: false })
    schema: Schema;
}

export default Project;
