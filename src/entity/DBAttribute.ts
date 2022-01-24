import {
    Entity, Column, ManyToOne, PrimaryColumn, JoinColumn,
} from 'typeorm';
import DBEntity from './DBEntity';
import {AttributeType} from "../../../Api-Builder-Types";

@Entity()
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
    type: string;

    @ManyToOne(() => DBEntity,
        (entity) => entity.attributes,
        { onDelete: 'CASCADE' })
    @JoinColumn()
    entity: DBEntity;
}

export default DBAttribute;
