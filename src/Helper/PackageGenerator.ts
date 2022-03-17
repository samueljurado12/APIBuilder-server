import DBProject from "../entity/DBProject";
import {ProjectType} from "api-builder-types";
import RelationalExporter from "./Exporter/RelationalExporter";
import StringFormatter from "./StringFormatter";
import * as path from "path";
import FileSaver from "./FileSaver";

const fs = require('fs')

export const GeneratePackage = async (dbProject: DBProject): Promise<string> => {
    if(dbProject.type === ProjectType.NoRelational) return;

    const formattedProjectName = StringFormatter(dbProject.name);
    const packagePath = path.join(__dirname,`../../Generated/${formattedProjectName}`);
    const templatesPath = path.join(__dirname, '../../Templates');
    const sqlSchema = await (new RelationalExporter(dbProject).export());

    FileSaver(`${packagePath}/files/${formattedProjectName}-compose.yml`,
        ModifyTemplate(`${templatesPath}/compose.yml`, formattedProjectName));
    FileSaver(`${packagePath}/files/${formattedProjectName}-schema.sql`, sqlSchema);
    FileSaver(`${packagePath}/${formattedProjectName}.sh`,
        ModifyTemplate(`${templatesPath}/script.sh`, formattedProjectName))
    FileSaver(`${packagePath}/running-instructions.txt`,
        ModifyTemplate(`${templatesPath}/running-instructions.txt`, formattedProjectName))

    return '';
}

const ModifyTemplate = (templatePath:string , projectName: string): string => {
    return fs.readFileSync(templatePath, 'utf-8').replace('ProjectName', projectName);
}
