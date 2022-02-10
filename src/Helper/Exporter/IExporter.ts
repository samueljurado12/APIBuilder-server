import DBProject from "../../entity/DBProject";

abstract class IExporter {
    protected dbProject: DBProject;
    abstract async export();

    protected formatString(input: string):string{
        return input.trim().replace(/\s+/, '_');
    }
    constructor(dbProject: DBProject) {
        this.dbProject = dbProject;
    }
}

export default IExporter;
