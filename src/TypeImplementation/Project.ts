import {IProject, ProjectType} from "../../../Api-Builder-Types";
import DBProject from "../entity/DBProject";

class Project implements IProject {
    Description: string;
    Identifier: string;
    Name: string;
    Type: ProjectType;

    constructor(project: DBProject) {
        this.Description = project.description
        this.Identifier = project.id
        this.Name = project.name
        this.Type = project.type
    }

}

export default Project
