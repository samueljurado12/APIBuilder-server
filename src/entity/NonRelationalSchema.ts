import { Entity, OneToMany } from 'typeorm';

import Schema from './Schema';
import JsonEntity from './JsonEntity';

@Entity()
class NonRelationalSchema extends Schema {
    @OneToMany(() => JsonEntity, (entity) => entity.nonRelationalSchema,
        {
            onDelete: 'CASCADE',
        })
    JsonEntities: JsonEntity[];
}

export default NonRelationalSchema;
