import {
    Column, Entity, ManyToOne, OneToMany, PrimaryColumn,
} from 'typeorm';
import { Guid } from 'guid-typescript';
import RelationalSchema from './RelationalSchema';
import SQLColumn from './SQLColumn';
import Constraint from './Constraint';

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

    @OneToMany(() => Constraint, (constraint) => constraint.table)
    constraints: Constraint[];
}

export default SQLTable;
