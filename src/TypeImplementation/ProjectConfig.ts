import { IEntity, IProjectConfig, ProjectType } from 'api-builder-types';

class ProjectConfig implements IProjectConfig {
    Description: string;

    Entities: IEntity[];

    Identifier: string;

    Type: ProjectType;

    constructor(Description: string, Identifier: string, Type: ProjectType) {
        this.Description = Description;
        this.Identifier = Identifier;
        this.Type = Type;
    }
}

export default ProjectConfig;
