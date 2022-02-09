import {
    Entity, Column, ManyToOne, PrimaryColumn, JoinColumn,
} from 'typeorm';
import { IRelationship } from 'api-builder-types';
import DBEntity from './DBEntity';

@Entity({ name: 'relationship' })
class DBRelationship {
    constructor(relationship: IRelationship, entity: DBEntity) {
        if (relationship !== undefined) {
            this.id = relationship.Identifier;
            this.leftSide = entity;
            this.rightSide = relationship.RightSide.Entity;
            this.referencedPK = relationship.RightSide.PrimaryKeyReferenced;
        }
    }

    @PrimaryColumn({
        type: 'varchar',
    })
    id: string;

    @ManyToOne(() => DBEntity,
        (entity) => entity.relationships,
        {
            onDelete: 'CASCADE',
            cascade: true,
        })
    @JoinColumn()
    leftSide: DBEntity;

    @Column({
        type: 'varchar',
    })
    rightSide: string;

    @Column({
        type: 'varchar',
    })
    referencedPK: string;
}

export default DBRelationship;
