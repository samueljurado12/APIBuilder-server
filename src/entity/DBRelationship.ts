import {
    Entity, Column, ManyToOne, PrimaryColumn, JoinColumn,
} from 'typeorm';
import DBEntity from './DBEntity';

@Entity({ name: 'relationship' })
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
    rightSide: string;

    @Column({
        type: 'varchar',
    })
    referencedPK: string;
}

export default DBRelationship;
