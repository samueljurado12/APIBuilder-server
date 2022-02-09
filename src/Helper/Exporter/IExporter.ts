import DBProject from "../../entity/DBProject";

abstract class IExporter {
    protected dbProject: DBProject;
    abstract async export();


    protected constructor(dbProject: DBProject) {
        this.dbProject = dbProject;
    }
}

export default IExporter;
