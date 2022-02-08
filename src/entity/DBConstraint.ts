import {
    Column, Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { ConstraintType, IConstraint } from 'api-builder-types';
import DBEntity from './DBEntity';

@Entity({ name: 'constraint' })
class DBConstraint {
    constructor(constraint: IConstraint, entity: DBEntity) {
        if (constraint !== undefined) {
            this.id = constraint.Identifier;
            this.entity = entity;
            this.attributes = constraint.Attributes.join('|');
            this.type = constraint.Type;
        }
    }

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
            cascade: true,
        })
    @JoinColumn()
    entity: DBEntity;
}

export default DBConstraint;
