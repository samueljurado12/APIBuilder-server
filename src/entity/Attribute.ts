import {
    Entity, Column, ManyToOne, PrimaryColumn,
} from 'typeorm';
import ProjectEntity from './ProjectEntity';

export enum AttributeType {
    String,
    Date,
    Bool,
    Numeric
}

@Entity()
class Attribute {
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
    IsMandatory: boolean;

    @Column({
        type: 'enum',
        enum: AttributeType,
        default: AttributeType.String,
    })
    type: string;

    @ManyToOne(() => ProjectEntity,
        (entity) => entity.attributes,
        { onDelete: 'CASCADE' })
    entity: ProjectEntity;
}

export default Attribute;
