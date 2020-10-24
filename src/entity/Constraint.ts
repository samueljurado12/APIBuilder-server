import {
    Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Guid } from 'guid-typescript';
import SQLTable from './SQLTable';

enum ConstraintType {
    CHECK = 'check',
    FK = 'foreign_key',
    UQ = 'unique',
    INDEX = 'index',
    PK = 'primary_key'
}

@Entity()
class Constraint {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: Guid;

    @Column({
        type: 'varchar',
        length: 128,
    })
    name: string;

    @Column({
        type: 'enum',
        enum: ConstraintType,
    })
    type: ConstraintType;

    @Column({
        type: 'text',
    })
    checkText: string;

    @ManyToOne(() => SQLTable, (table) => table.constraints)
    table: SQLTable;
}

export default Constraint;
