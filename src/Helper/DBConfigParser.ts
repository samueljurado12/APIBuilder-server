import {
    IAttribute, IConstraint, IEntity, IProjectConfig, IRelationship,
} from 'api-builder-types';
import {getRepository} from 'typeorm';
import DBProject from '../entity/DBProject';
import ProjectConfig from '../TypeImplementation/ProjectConfig';
import Entity from '../TypeImplementation/Entity';
import Attribute from '../TypeImplementation/Attribute';
import Relationship from '../TypeImplementation/Relationship';
import Constraint from '../TypeImplementation/Constraint';
import DBEntity from '../entity/DBEntity';
import DBAttribute from '../entity/DBAttribute';
import DBConstraint from '../entity/DBConstraint';
import DBRelationship from '../entity/DBRelationship';

export const parseDBToConfig = async (dbProject: DBProject): Promise<ProjectConfig> => {
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
        entity.Constraints = dbEnt.constraints.map<IConstraint>((dbConstraint) => new Constraint(dbConstraint.attributes.split('|'), dbConstraint.id, dbConstraint.type));
        return entity;
    });
    return projectConfig;
};

export const parseConfigToDB = async (projectConfig: IProjectConfig, userId: string):
Promise<[DBProject, DBEntity[], DBAttribute[], DBConstraint[], DBRelationship[]]> => {
    const dbProject: DBProject = await getRepository(DBProject)
        .findOne({ where:{id: projectConfig.Identifier, ownerId:userId }});
    let dbEntities : DBEntity[] = [];
    let dbAttributes : DBAttribute[] = [];
    let dbConstraints : DBConstraint[] = [];
    let dbRelationships : DBRelationship[] = [];
    if (dbProject) {
        dbProject.type = projectConfig.Type;
        dbEntities = projectConfig.Entities.map<DBEntity>((ent) => {
            const dbEnt: DBEntity = new DBEntity(ent, dbProject);
            dbAttributes = dbAttributes.concat(ent.Attributes
                .map<DBAttribute>((attr) =>
                    new DBAttribute(attr, dbEnt, ent.PK.includes(attr.Identifier))));
            dbConstraints = dbConstraints.concat(ent.Constraints
                .map<DBConstraint>((constr) => new DBConstraint(constr, dbEnt)));
            dbRelationships = dbRelationships.concat(ent.Relationships
                .map<DBRelationship>((rel) => new DBRelationship(rel, dbEnt)));
            return dbEnt;
        });
    }
    return [dbProject, dbEntities, dbAttributes, dbConstraints, dbRelationships];
};
