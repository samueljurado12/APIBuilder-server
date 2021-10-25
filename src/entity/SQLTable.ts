import {
    Column, Entity, ManyToOne, OneToMany, PrimaryColumn,
} from 'typeorm';
import { Guid } from 'guid-typescript';
import RelationalSchema from './RelationalSchema';
import SQLColumn from './SQLColumn';

@Entity()
class SQLTable {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: Guid;

    @Column({
        type: 'varchar',
        length: 64,
    })
    name: string;

    @ManyToOne(() => RelationalSchema, (schema) => schema.tables, {
        nullable: false,
    })
    schema: RelationalSchema;

    @OneToMany(() => SQLColumn, (column) => column.table, {
        onDelete: 'CASCADE',
    })
    columns: SQLColumn[];

}

export default SQLTable;
