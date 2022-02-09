import DBProject from "../../entity/DBProject";
import IExporter from "./IExporter";
import {ProjectType} from "api-builder-types";
import NonRelationalExporter from "./NonRelationalExporter";
import RelationalExporter from "./RelationalExporter";

export const ExporterFactory = (dbProject: DBProject): IExporter => {
    let exporter: IExporter;
    switch (dbProject.type) {
        case ProjectType.NoRelational:
            exporter = new NonRelationalExporter();
            break;
        case ProjectType.Relational:
            exporter = new RelationalExporter();
            break;
    }
    return exporter;
}
