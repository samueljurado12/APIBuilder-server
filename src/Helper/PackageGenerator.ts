import DBProject from "../entity/DBProject";
import {ProjectType} from "../../../Api-Builder-Types";
import RelationalExporter from "./Exporter/RelationalExporter";
import {formatString} from "./StringFormatter";

const fs = require('fs')

export const GeneratePackage = async (dbProject: DBProject): Promise<string> => {
    if(dbProject.type === ProjectType.NoRelational) return;

    const formattedProjectName = formatString(dbProject.name)
    const generatedFilePath = `./${formattedProjectName}/${formattedProjectName}`;
    const sqlSchema = await (new RelationalExporter(dbProject).export());

    let modifiedTemplate = fs.readFileSync('/Templates/compose.yml', 'utf-8');
    modifiedTemplate.replace('ProjectName', formattedProjectName);
    fs.writeFileSync(`${generatedFilePath}-compose.yml`, modifiedTemplate);
    fs.writeFileSync(`${generatedFilePath}-schema.sql`, sqlSchema)


    return "";
}
