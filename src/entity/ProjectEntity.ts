import {
    Entity, PrimaryColumn, JoinColumn, ManyToOne, Column, OneToMany,
} from 'typeorm';

import Project from './Project';
import Attribute from './Attribute';

@Entity()
abstract class ProjectEntity {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: string;

    @ManyToOne(() => Project, (project) => project.entities,
        {
            nullable: false,
            onDelete: 'CASCADE',
        })
    @JoinColumn()
    project: Project;

    @Column({
        type: 'varchar',
    })
    name: string;

    @OneToMany(() => Attribute,
        (attribute) => attribute.entity,
        { onDelete: 'CASCADE' })
    attributes: Attribute[];
}

export default ProjectEntity;
