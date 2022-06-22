import DBProject from '../../entity/DBProject';
import DBEntity from "../../entity/DBEntity";
import DBRelationship from "../../entity/DBRelationship";
import DBAttribute from "../../entity/DBAttribute";
import DBConstraint from "../../entity/DBConstraint";
import {AttributeType} from "../../../../Api-Builder-Types";

abstract class ExporterAbstract {
    abstract export(project: DBProject): Promise<string>;
    abstract parseEntities(entities: DBEntity[]): Promise<string>;
    abstract parseAttributes(attributes: DBAttribute[]): string;
    abstract parsePrimaryKeys(attributes: DBAttribute[]): string;
    abstract parseRelationships(relationships: DBRelationship[], entities: DBEntity[]): string;
    abstract parseConstraints(constraints: DBConstraint[], attributes: DBAttribute[]): string;

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

export default ExporterAbstract;
