import {
    Entity, Column, OneToMany, PrimaryColumn,
} from 'typeorm';
import DBProject from './DBProject';

@Entity({ name: 'user' })
class DBUser {
    @PrimaryColumn({
        type: 'varchar',
    })
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        nullable: true,
    })
    age: number;

    @Column({
        type: 'varchar',
        length: 256,
    })
    hashedPassword: string;

    @Column({
        type: "varchar",
        length: 100,
        unique: true
    })
    email: string;

    @Column({
        type: "varchar",
        length: (100),
        unique: true
    })
    username: string;

    @OneToMany(() => DBProject, (project) => project.owner)
    projects: DBProject[];
}

export default DBUser;
