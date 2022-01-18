import {
    Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';

import User from './User';
import ProjectEntity from './ProjectEntity';

export enum ProjectType {
    Relational = 'Relational',
    NonRelational = 'NonRelational'
}

@Entity()
class Project {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 5000,
    })
    description: string;

    @Column({
        type: 'enum',
        enum: ProjectType,
        default: ProjectType.Relational,
    })
    type: ProjectType;

    @ManyToOne(() => User, (user) => user.projects, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    owner: User;

    @OneToMany(() => ProjectEntity,
        (entity) => entity.project,
        { onDelete: 'CASCADE' })
    entities: ProjectEntity[];
}

export default Project;
