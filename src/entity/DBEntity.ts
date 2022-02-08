import {
    Entity, PrimaryColumn, JoinColumn, ManyToOne, Column, OneToMany,
} from 'typeorm';

import DBProject from './DBProject';
import DBAttribute from './DBAttribute';
import DBRelationship from './DBRelationship';
import DBConstraint from './DBConstraint';
import { IEntity } from '../../../Api-Builder-Types';

@Entity({ name: 'entity' })
class DBEntity {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'int',
    })
    xPos: number;

    @Column({
        type: 'int',
    })
    yPos: number;

    @OneToMany(() => DBAttribute,
        (attribute) => attribute.entity)
    attributes: DBAttribute[];

    @OneToMany(() => DBRelationship,
        (rel) => rel.leftSide)
    relationships: DBRelationship[];

    @OneToMany(() => DBConstraint,
        (constraint) => constraint.entity)
    constraints: DBConstraint[];

    @ManyToOne(() => DBProject, (project) => project.entities,
        {
            nullable: false,
            onDelete: 'CASCADE',
            cascade: true,
        })
    @JoinColumn()
    project: DBProject;

    constructor(entity: IEntity, project: DBProject) {
        if (entity !== undefined) {
            this.id = entity.Identifier;
            this.name = entity.Name;
            this.xPos = entity.Coordinates.X;
            this.yPos = entity.Coordinates.Y;
            this.project = project;
        }
    }
}

export default DBEntity;
