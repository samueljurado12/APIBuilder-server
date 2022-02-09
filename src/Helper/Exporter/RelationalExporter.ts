import IExporter from "./IExporter";
import DBProject from "../../entity/DBProject";
import DBEntity from "../../entity/DBEntity";
import DBAttribute from "../../entity/DBAttribute";
import {AttributeType} from "../../../../Api-Builder-Types";

class RelationalExporter extends IExporter {
    protected dbProject: DBProject

    async export() {
        let sql: string = "";
        sql += `CREATE SCHEMA ${this.dbProject.name};USE ${this.dbProject.name}`
        sql += await this.parseEntities(this.dbProject.entities)
    }

    parseEntities = async (entities: DBEntity[]): Promise<string>=>{
        let result: string;

        entities.reduce<string>((reducer: string, ent): string => {
            return reducer + `CREATE TABLE ${ent} (${this.parseAttributes(ent.attributes)})`
        }, "")

        return result;
    }

    parseAttributes = (attributes: DBAttribute[]): string => {
        return attributes.reduce<string>((reducer:string, attr): string => {
            return reducer + `${attr.name} ${this.parseAttributeType(attr.type, attr.precision)}`;
        }, "")
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
