import IExporter from "./IExporter";
import DBProject from "../../entity/DBProject";
import DBEntity from "../../entity/DBEntity";
import DBAttribute from "../../entity/DBAttribute";
import {AttributeType} from "../../../../Api-Builder-Types";

class RelationalExporter extends IExporter {
    protected dbProject: DBProject

    async export() {
        const formattedName: string = this.formatString(this.dbProject.name);
        let sql: string = "";
        sql += `CREATE SCHEMA ${formattedName};USE ${formattedName};`
        sql += await this.parseEntities(this.dbProject.entities)
    }

    parseEntities = async (entities: DBEntity[]): Promise<string>=>{
        let result: string;

        result = entities.reduce<string>((reducer: string, ent): string => {
            return reducer + `CREATE TABLE ${this.formatString(ent.name)} (${this.parseAttributes(ent.attributes)},`+
                ` PRIMARY KEY (${ent.attributes.filter(attr => attr.primaryKeyInd).map(attr => this.formatString(attr.name))}));`
        }, "")

        return result;
    }

    parseAttributes = (attributes: DBAttribute[]): string => {
        return attributes.map<string>(attr => { return `${this.formatString(attr.name)} ${this.parseAttributeType(attr.type, attr.precision)}`}).join(',')
    }

    parseAttributeType = (type: AttributeType, precision: number): string => {
        let result: string;
        switch (type){
            case AttributeType.Bool:
                result = "boolean";
                break;
            case AttributeType.String:
                result = `varchar(${precision | 255})`;
                break;
            case AttributeType.Date:
                result = "datetime";
                break;
            case AttributeType.Numeric:
                result = precision !== undefined ? `decimal(${precision}, 3)` : "int";
                break;
        }
        return result;
    }

}

export default RelationalExporter;
