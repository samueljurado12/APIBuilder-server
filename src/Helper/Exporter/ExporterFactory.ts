import { ProjectType } from 'api-builder-types';
import DBProject from '../../entity/DBProject';
import ExporterAbstract from './ExporterAbstract';
import MySQLExporter from './MySQLExporter';

const ExporterFactory = (dbProject: DBProject): ExporterAbstract => {
    let exporter: ExporterAbstract;
    switch (dbProject.type) {
        case ProjectType.Relational:
            exporter = new MySQLExporter();
            break;
        default:
            exporter = null;
            break;
    }
    return exporter;
};

export default ExporterFactory;
