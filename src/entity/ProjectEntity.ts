import {
    Entity, PrimaryColumn, JoinColumn, ManyToOne, Column, OneToMany,
} from 'typeorm';

import Project from './Project';
import Attribute from './Attribute';
import Relationship from './Relationship';

@Entity({ name: 'entity' })
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
        (attribute) => attribute.entity)
    attributes: Attribute[];

    @OneToMany(() => Relationship,
        (rel) => rel.leftSide)
    relationships: Relationship[];
}

export default ProjectEntity;
