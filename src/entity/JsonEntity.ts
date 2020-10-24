import {
    Column, Entity, ManyToOne, OneToMany, PrimaryColumn,
} from 'typeorm';
import { Guid } from 'guid-typescript';
import NonRelationalSchema from './NonRelationalSchema';
import JsonProperty from './JsonProperty';

@Entity()
class JsonEntity {
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

    @ManyToOne(() => NonRelationalSchema, (nrSchema) => nrSchema.JsonEntities)
    nonRelationalSchema: NonRelationalSchema;

    @OneToMany(() => JsonProperty, (property) => property.jsonEntity,
        {
            onDelete: 'CASCADE',
        })
    properties: JsonProperty[];

    @OneToMany(() => JsonProperty, prop => prop.typeEntity)
    typeProperties: JsonProperty[]
}

export default JsonEntity;
