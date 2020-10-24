import { Entity, OneToMany } from 'typeorm';

import Schema from './Schema';
import SQLTable from './SQLTable';

@Entity()
class RelationalSchema extends Schema {
    @OneToMany(() => SQLTable, (table) => table.schema, {
        onDelete: 'CASCADE',
    })
    tables: SQLTable[];
}

export default RelationalSchema;
