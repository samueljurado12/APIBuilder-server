import {
    Entity, Column, ManyToOne, PrimaryColumn, JoinColumn,
} from 'typeorm';
import { AttributeType, IAttribute } from 'api-builder-types';
import DBEntity from './DBEntity';

@Entity({ name: 'attribute' })
class DBAttribute {
    constructor(attribute: IAttribute, entity: DBEntity, isPK: boolean) {
        if (attribute !== undefined) {
            this.id = attribute.Identifier;
            this.name = attribute.Name;
            this.type = attribute.Type;
            this.primaryKeyInd = isPK;
            this.mandatoryInd = attribute.IsMandatory;
            this.defaultValue = attribute.DefaultValue;
            this.precision = attribute.Precision;
            this.entity = entity;
        }
    }

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
        {
            onDelete: 'CASCADE',
            cascade: true,
        })
    @JoinColumn()
    entity: DBEntity;
}

export default DBAttribute;
