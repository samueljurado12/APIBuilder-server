import {Entity, PrimaryColumn, OneToOne, JoinColumn} from "typeorm";
import { Guid } from "guid-typescript";

import {Project} from "./Project"

@Entity()
export abstract class Schema {
    @PrimaryColumn({
        type: "varchar"
    })
    id: Guid;

    @OneToOne(type => Project, project => project.schema,
        {
            nullable: false,
            onDelete: "CASCADE"
        })
    @JoinColumn()
    project: Project;

}