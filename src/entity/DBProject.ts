import {
    Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';

import { ProjectType } from 'api-builder-types';
import User from './DBUser';
import DBEntity from './DBEntity';

@Entity({ name: 'project' })
class DBProject {
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
        type: 'text',
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

    @OneToMany(() => DBEntity,
        (entity) => entity.project,
        { onDelete: 'CASCADE' })
    entities: DBEntity[];
}

export default DBProject;
