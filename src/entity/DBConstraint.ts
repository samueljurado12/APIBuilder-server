import {
    Column, Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { ConstraintType } from 'api-builder-types';
import DBEntity from './DBEntity';

@Entity({ name: 'constraint' })
class DBConstraint {
    @PrimaryColumn({
        type: 'varchar',
    })
    id:string;

    @Column({
        type: 'enum',
        enum: ConstraintType,
        default: ConstraintType.Unique,
    })
    type: ConstraintType;

    @Column({
        type: 'text',
        nullable: false,
    })
    attributes: string;

    @ManyToOne(() => DBEntity,
        (entity) => entity.constraints,
        {
            nullable: false,
            onDelete: 'CASCADE',
        })
    @JoinColumn()
    entity: DBEntity;
}

export default DBConstraint;
