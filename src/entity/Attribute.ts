import {
    Entity, Column, ManyToOne, PrimaryColumn, JoinColumn,
} from 'typeorm';
import ProjectEntity from './ProjectEntity';

export enum AttributeType {
    String = 'String',
    Date = 'Date',
    Bool = 'Bool',
    Numeric = 'Numeric'
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
    @JoinColumn()
    entity: ProjectEntity;
}

export default Attribute;
