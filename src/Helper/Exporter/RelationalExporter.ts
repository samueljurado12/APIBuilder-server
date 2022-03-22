import { AttributeType, ConstraintType } from 'api-builder-types';
import IExporter from './IExporter';
import DBProject from '../../entity/DBProject';
import DBEntity from '../../entity/DBEntity';
import DBAttribute from '../../entity/DBAttribute';
import DBRelationship from '../../entity/DBRelationship';
import DBConstraint from '../../entity/DBConstraint';
import StringFormatter from '../StringFormatter';

class RelationalExporter extends IExporter {
    protected dbProject: DBProject;

    async export(): Promise<string> {
        const formattedName: string = StringFormatter(this.dbProject.name);
        let sql: string = '';
        sql += `CREATE SCHEMA ${formattedName};USE ${formattedName};`;
        sql += await this.parseEntities(this.orderEntities(this.dbProject.entities));
        return sql;
    }

    parseEntities = async (entities: DBEntity[]): Promise<string> => {
        return entities.reduce<string>((reducer: string, ent): string => `${reducer}CREATE TABLE ${StringFormatter(ent.name)} (${this.parseAttributes(ent.attributes)}`
                + `${this.parsePrimaryKeys(ent.attributes)}`
                + `${this.parseRelationships(ent.relationships, entities)}`
                + `${this.parseConstraints(ent.constraints, ent.attributes)});`, '');
    };

    parsePrimaryKeys = (attributes: DBAttribute[]): string => {
        const pks: string[] = attributes.filter((attr) => attr.primaryKeyInd)
            .map((attr) => StringFormatter(attr.name));
        return pks.length > 0 ? `, PRIMARY KEY (${pks.join(',')})` : '';
    };

    parseRelationships = (relationships: DBRelationship[], entities: DBEntity[]): string =>
        relationships.map((rel) => {
        const dbEntity: DBEntity = entities
            .find((ent) => ent.id === rel.rightSide);
        const dbAttribute: DBAttribute = dbEntity.attributes
            .find((attr) => attr.id === rel.referencedPK);
        return `, FOREIGN KEY (${StringFormatter(dbEntity.name)}Id) REFERENCES ${StringFormatter(dbEntity.name)}(${dbAttribute.name})`;
    }).join();

    parseConstraints = (constraints: DBConstraint[], attributes: DBAttribute[]):string =>
        constraints.filter((c) => c.type === ConstraintType.Unique).map((c) => {
        const attrIds = c.attributes.split('|');
        const attrs: DBAttribute[] = attributes.filter((attr) => attrIds.includes(attr.id));
        return `, UNIQUE (${attrs.map((attr) => StringFormatter(attr.name)).join(',')})`;
    }).join();

    parseAttributes = (attributes: DBAttribute[]): string => attributes.map<string>((attr) => `${StringFormatter(attr.name)} `
            + `${this.parseAttributeType(attr.type, attr.precision)}`
            + `${attr.mandatoryInd ? ' NOT NULL' : ''}`
        + `${attr.defaultValue !== null ? ` DEFAULT ${attr.defaultValue}` : ''} `).join(',');

    parseAttributeType = (type: AttributeType, precision: number): string => {
        let result: string;
        switch (type) {
            case AttributeType.Bool:
                result = 'boolean';
                break;
            case AttributeType.String:
                result = `varchar(${precision | 255})`;
                break;
            case AttributeType.Date:
                result = 'datetime';
                break;
            case AttributeType.Numeric:
                result = precision !== undefined ? `decimal(${precision}, 3)` : 'int';
                break;
            default:
                result = 'varchar(255)';
                break;
        }
        return result;
    };

    orderEntities = (entities: DBEntity[]): DBEntity[] => {
        const allRelationships: DBRelationship[] = entities
            .reduce<DBRelationship[]>((red: DBRelationship[], ent) =>
                red.concat(ent.relationships), []);
        return entities.sort((ent1, ent2) =>
            allRelationships.filter((rel) => ent1.relationships.includes(rel)
                    && rel.rightSide === ent2.id).length
                - allRelationships.filter((rel) => ent2.relationships.includes(rel)
                    && rel.rightSide === ent1.id).length);
    };
}

export default RelationalExporter;
