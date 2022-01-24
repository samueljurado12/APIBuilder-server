import {IProjectConfig, IEntity, ProjectType} from "../../../Api-Builder-Types";

class ProjectConfig implements IProjectConfig{
    Description: string;
    Entities: IEntity[];
    Identifier: string;
    Type: ProjectType;

}

export default ProjectConfig
