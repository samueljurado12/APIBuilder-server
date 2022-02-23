import IExporter from "./IExporter";
import DBProject from "../../entity/DBProject";

class NonRelationalExporter extends IExporter {
    protected dbProject: DBProject;

    async export() {
    }
}

export default NonRelationalExporter;
