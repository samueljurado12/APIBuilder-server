import DBProject from "../../entity/DBProject";

abstract class IExporter {
    protected dbProject: DBProject;
    abstract async export();

    constructor(dbProject: DBProject) {
        this.dbProject = dbProject;
    }
}

export default IExporter;
