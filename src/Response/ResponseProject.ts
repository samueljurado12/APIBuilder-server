import {IProject, ProjectType} from "../../../Api-Builder-Types";

class ResponseProject implements IProject {
    Description: string;
    Identifier: string;
    Name: string;
    Type: ProjectType;

    constructor(id: string, name: string, type: string, desc: string) {
        this.Description = desc;
        this.Identifier = id;
        this.Name = name;
        this.Type = ProjectType[type];
    }

}

export default ResponseProject;