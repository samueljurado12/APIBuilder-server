import { ProjectType } from 'api-builder-types';
import DBProject from '../../entity/DBProject';
import IExporter from './IExporter';
import RelationalExporter from './RelationalExporter';

const ExporterFactory = (dbProject: DBProject): IExporter => {
    let exporter: IExporter;
    switch (dbProject.type) {
        case ProjectType.Relational:
            exporter = new RelationalExporter(dbProject);
            break;
        default:
            exporter = null;
            break;
    }
    return exporter;
};

export default ExporterFactory;
