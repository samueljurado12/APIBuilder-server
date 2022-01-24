import {
    Entity, Column, ManyToOne, PrimaryColumn, JoinColumn,
} from 'typeorm';
import DBEntity from './DBEntity';
import DBAttribute from './DBAttribute';

@Entity({name:"relationship"})
class DBRelationship {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: string;

    @ManyToOne(() => DBEntity,
        (entity) => entity.relationships,
        { onDelete: 'CASCADE' })
    @JoinColumn()
    leftSide: DBEntity;

    @Column({
        type: 'varchar',
    })
    rightSide:DBEntity;

    @Column({
        type: 'varchar',
    })
    referencedPK:DBAttribute;
}

export default DBRelationship;
