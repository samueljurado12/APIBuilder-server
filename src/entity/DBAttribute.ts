import {
    Entity, Column, ManyToOne, PrimaryColumn, JoinColumn,
} from 'typeorm';
import { AttributeType } from 'api-builder-types';
import DBEntity from './DBEntity';

@Entity({ name: 'attribute' })
class DBAttribute {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: string;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'boolean',
    })
    mandatoryInd: boolean;

    @Column({
        type: 'boolean',
    })
    primaryKeyInd: boolean;

    @Column({
        type: 'enum',
        enum: AttributeType,
        default: AttributeType.String,
    })
    type: AttributeType;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    defaultValue: string;

    @Column({
        type: 'int',
        nullable: true,
    })
    precision: number;

    @ManyToOne(() => DBEntity,
        (entity) => entity.attributes,
        { onDelete: 'CASCADE' })
    @JoinColumn()
    entity: DBEntity;
}

export default DBAttribute;
