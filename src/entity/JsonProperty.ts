import {
    Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';

import { Guid } from 'guid-typescript';
import JsonEntity from './JsonEntity';

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
}

export default JsonProperty;
