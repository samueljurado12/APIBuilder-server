import IExporter from "./IExporter";
import DBProject from "../../entity/DBProject";
import DBEntity from "../../entity/DBEntity";
import DBAttribute from "../../entity/DBAttribute";
import {AttributeType} from "../../../../Api-Builder-Types";
import DBRelationship from "../../entity/DBRelationship";

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
            return reducer + `CREATE TABLE ${this.formatString(ent.name)} (${this.parseAttributes(ent.attributes)}`+
                ` ${this.parsePrimaryKeys(ent.attributes)}`+
                `${this.parseRelationships(ent.relationships, entities)});`
        }, "")

        return result;
    }

    parsePrimaryKeys = (attributes: DBAttribute[]): string => {
        const pks: string[] = attributes.filter(attr => attr.primaryKeyInd).map(attr => this.formatString(attr.name));
        return pks.length > 0 ? `, PRIMARY KEY (${pks.join(',')})` : '';
    }

    parseRelationships = (relationships: DBRelationship[], entities: DBEntity[]): string => {
        return relationships.map(rel => {
            const ent: DBEntity = entities.find(ent => ent.id === rel.rightSide);
            const attr: DBAttribute = ent.attributes.find (attr => attr.id === rel.referencedPK);
            return `, FOREIGN KEY (${this.formatString(ent.name)}Id) REFERENCES ${this.formatString(ent.name)}(${attr.name})`;
        }).join();
    }

    parseAttributes = (attributes: DBAttribute[]): string => {
        return attributes.map<string>(attr => { return `${this.formatString(attr.name)} ` +
            `${this.parseAttributeType(attr.type, attr.precision)}` +
            `${attr.mandatoryInd ? ' NOT NULL':''}` +
        `${attr.defaultValue !== null ? ` DEFAULT ${attr.defaultValue}` : ''} `}).join(',')
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
