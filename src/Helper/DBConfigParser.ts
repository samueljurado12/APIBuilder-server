import {IAttribute, IConstraint, IEntity, IRelationship} from 'api-builder-types';
import DBProject from '../entity/DBProject';
import ProjectConfig from '../TypeImplementation/ProjectConfig';
import Entity from '../TypeImplementation/Entity';
import Attribute from '../TypeImplementation/Attribute';
import Relationship from '../TypeImplementation/Relationship';
import Constraint from "../TypeImplementation/Constraint";

export const parseDBConfig = (dbProject: DBProject): ProjectConfig => {
    const projectConfig: ProjectConfig = new ProjectConfig(dbProject.description, dbProject.id,
        dbProject.type);
    projectConfig.Entities = dbProject.entities.map<IEntity>((dbEnt) => {
        const entity: IEntity = new Entity(dbEnt.id, dbEnt.name, dbEnt.xPos, dbEnt.yPos);
        entity.Attributes = dbEnt.attributes
            .map<IAttribute>((dbAttr) => new Attribute(dbAttr.id, dbAttr.mandatoryInd,
            dbAttr.name, dbAttr.type, dbAttr.defaultValue, dbAttr.precision));
        entity.PK = dbEnt.attributes.filter(((dbAttr) => dbAttr.primaryKeyInd))
            .map((dbAttr) => dbAttr.id);
        entity.Relationships = dbEnt.relationships
            .map<IRelationship>(
            (dbRel) => new Relationship(dbRel.id, dbRel.rightSide, dbRel.referencedPK),
        );
        entity.Constraints = dbEnt.constraints.map<IConstraint>((dbConstraint) =>
             new Constraint(dbConstraint.attributes.split('|'), dbConstraint.id, dbConstraint.type)
        )
        return entity;
    });
    return projectConfig;
};
