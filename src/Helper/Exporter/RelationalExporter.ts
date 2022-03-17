import IExporter from "./IExporter";
import DBProject from "../../entity/DBProject";
import DBEntity from "../../entity/DBEntity";
import DBAttribute from "../../entity/DBAttribute";
import {AttributeType, ConstraintType} from "api-builder-types";
import DBRelationship from "../../entity/DBRelationship";
import DBConstraint from "../../entity/DBConstraint";
import {StringFormatter} from "../StringFormatter";

class RelationalExporter extends IExporter {
    protected dbProject: DBProject

    async export(): Promise<string> {
        const formattedName: string = StringFormatter(this.dbProject.name);
        let sql: string = "";
        sql += `CREATE SCHEMA ${formattedName};USE ${formattedName};`;
        sql += await this.parseEntities(this.orderEntities(this.dbProject.entities));
        return sql;
    }

    parseEntities = async (entities: DBEntity[]): Promise<string>=>{
        let result: string;

        result = entities.reduce<string>((reducer: string, ent): string => {
            return reducer + `CREATE TABLE ${StringFormatter(ent.name)} (${this.parseAttributes(ent.attributes)}`+
                `${this.parsePrimaryKeys(ent.attributes)}`+
                `${this.parseRelationships(ent.relationships, entities)}` +
                `${this.parseConstraints(ent.constraints, ent.attributes)});`
        }, "")

        return result;
    }

    parsePrimaryKeys = (attributes: DBAttribute[]): string => {
        const pks: string[] = attributes.filter(attr => attr.primaryKeyInd).map(attr => StringFormatter(attr.name));
        return pks.length > 0 ? `, PRIMARY KEY (${pks.join(',')})` : '';
    }

    parseRelationships = (relationships: DBRelationship[], entities: DBEntity[]): string => {
        return relationships.map(rel => {
            const ent: DBEntity = entities.find(ent => ent.id === rel.rightSide);
            const attr: DBAttribute = ent.attributes.find (attr => attr.id === rel.referencedPK);
            return `, FOREIGN KEY (${StringFormatter(ent.name)}Id) REFERENCES ${StringFormatter(ent.name)}(${attr.name})`;
        }).join();
    }

    parseConstraints = (constraints: DBConstraint[], attributes: DBAttribute[]):string => {
        return constraints.filter(c => c.type === ConstraintType.Unique).map(c => {
            const attrIds = c.attributes.split('|');
            const attrs: DBAttribute[] = attributes.filter(attr => attrIds.includes(attr.id));
            return `, UNIQUE (${attrs.map(attr => StringFormatter(attr.name)).join(',')})`;
        }).join();
    }

    parseAttributes = (attributes: DBAttribute[]): string => {
        return attributes.map<string>(attr => { return `${StringFormatter(attr.name)} ` +
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

    orderEntities = (entities: DBEntity[]): DBEntity[] => {

        const allRelationships: DBRelationship[] = entities.
        reduce<DBRelationship[]>((red: DBRelationship[],ent) =>
            red.concat(ent.relationships), []);
        entities = entities.sort((ent1, ent2) => {
            return allRelationships.filter(rel => ent1.relationships.includes(rel) && rel.rightSide === ent2.id).length -
                allRelationships.filter(rel => ent2.relationships.includes(rel) && rel.rightSide === ent1.id).length
        })

        return entities;
    }

}

export default RelationalExporter;
