import { ProjectType } from 'api-builder-types';
import * as path from 'path';
import DBProject from '../entity/DBProject';
import MySQLExporter from './Exporter/MySQLExporter';
import StringFormatter from './StringFormatter';

const fs = require('fs');
const JSZip = require('jszip');

const ModifyTemplate = (templatePath:string, projectName: string): string => {
    const str = fs.readFileSync(templatePath, 'utf-8');
    return str.replace(/ProjectName/g, projectName);
};

const GeneratePackage = async (dbProject: DBProject): Promise<string> => {
    if (dbProject.type === ProjectType.NoRelational) return '';

    const zip = new JSZip();
    const formattedProjectName = StringFormatter(dbProject.name);
    const templatesPath = path.join(__dirname, '../../Templates');
    const sqlSchema = await (new MySQLExporter().export(dbProject));

    zip.folder('files').file(`${formattedProjectName}-compose.yml`,
        ModifyTemplate(`${templatesPath}/compose.yml`, formattedProjectName));
    zip.folder('files').file(`${formattedProjectName}-schema.sql`, sqlSchema);
    zip.file(`${formattedProjectName}.sh`,
        ModifyTemplate(`${templatesPath}/script.sh`, formattedProjectName));
    zip.file('running-instructions.txt',
        ModifyTemplate(`${templatesPath}/running-instructions.txt`, formattedProjectName));

    return zip.generateAsync({ type: 'base64' });
};

export default GeneratePackage;
