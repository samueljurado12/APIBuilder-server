import {
    Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';

import { Guid } from 'guid-typescript';
import JsonEntity from './JsonEntity';

enum PropertyType {
    NUMBER = 'number',
    STRING = 'string',
    DATE = 'date',
    BOOLEAN = 'boolean',
    ENTITY = 'entity'
}

@Entity()
class JsonProperty {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: Guid;

    @Column({
        type: 'varchar',
        length: 64,
        nullable: false,
    })
    name: string;

    @ManyToOne(() => JsonEntity, (entity) => entity.properties,
        {
            nullable: false,
        })
    jsonEntity: JsonEntity;

    @Column({
        type: "enum",
        enum: PropertyType,
        default: PropertyType.STRING
    })
    type: PropertyType;

    @ManyToOne(()=>JsonEntity, entity => entity.typeProperties)
    typeEntity: JsonEntity

    @Column({
        type: "boolean",
        nullable: false,
        default: false
    })
    listInd: boolean;
}

export default JsonProperty;
