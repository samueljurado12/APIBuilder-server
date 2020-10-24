import {
    Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Guid } from 'guid-typescript';
import SQLTable from './SQLTable';

enum SQLType {
    VARCHAR = 'varchar',
    TEXT = 'text',
    INT = 'int',
    BIGINT = 'bigint',
    FLOAT = 'float',
    DOUBLE = 'double',
    DATE = 'date',
    DATETIME = 'datetime',
    TIMESTAMP = 'timestamp',
    BOOLEAN = 'boolean'
}

@Entity()
class SQLColumn {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: Guid;

    @Column({
        type: 'varchar',
        length: 64,
    })
    name: string;

    @Column({
        type: 'boolean',
        nullable: false,
        default: false,
    })
    nullableInd: boolean;

    @Column({
        type: 'varchar',
    })
    defaultValue: string;

    @Column({
        type: 'int',
    })
    length: number;

    @Column({
        type: 'int',
    })
    precision: number;

    @Column({
        type: 'enum',
        enum: SQLType,
    })
    type: SQLType;

    @ManyToOne(() => SQLTable, (table) => table.columns, {
        nullable: false,
    })
    table: SQLTable;
}
export default SQLColumn;
