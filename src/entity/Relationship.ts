import {
    Entity, Column, ManyToOne, PrimaryColumn, JoinColumn,
} from 'typeorm';
import ProjectEntity from './ProjectEntity';
import Attribute from './Attribute';

@Entity()
class Relationship {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: string;

    @ManyToOne(() => ProjectEntity,
        (entity) => entity.relationships,
        { onDelete: 'CASCADE' })
    @JoinColumn()
    leftSide: ProjectEntity;

    @Column({
        type: 'varchar',
    })
    rightSide:ProjectEntity;

    @Column({
        type: 'varchar',
    })
    referencedPK:Attribute;
}

export default Relationship;
