import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { IProjectConfig } from '../../../Api-Builder-Types';
import { parseConfigToDB, parseDBToConfig } from '../Helper/DBConfigParser';
import getFullDBProject from '../Helper/GetFullDBProject';
import DBProject from '../entity/DBProject';
import DBEntity from '../entity/DBEntity';
import DBAttribute from '../entity/DBAttribute';
import DBConstraint from '../entity/DBConstraint';
import DBRelationship from '../entity/DBRelationship';

class ProjectConfigController {
    static get = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = res.locals.jwtPayload;
        const dbProject = await getFullDBProject(req.params.id, userId);
        if (dbProject) {
            const projectConfig: IProjectConfig = await parseDBToConfig(dbProject);
            res.status(200).json(projectConfig);
        } else {
            res.status(404).send({
                error: `Project with id '${req.params.id}' not found.`,
            });
        }
        return res;
    };

    static update = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = res.locals.jwtPayload;
        const config: IProjectConfig = req.body as IProjectConfig;
        const [dbProject, dbEntities, dbAttributes,
            dbConstraints, dbRelationships] = await parseConfigToDB(config, userId);
        if (!dbProject) {
            return res.status(404).send({
                error: `Project with id '${config.Identifier}' not found.`,
            });
        }
        const projectActualState = await getFullDBProject(dbProject.id, userId);
        const allAttributeIds = [].concat(...(projectActualState.entities.map(e => e.attributes.map(a=>a.id))));
        const allConstraintIds = [].concat(...(projectActualState.entities.map(e => e.constraints.map(c=>c.id))));
        const allRelationShipIds = [].concat(...(projectActualState.entities.map(e => e.relationships.map(r=>r.id))));
        const dbEntitiesIdsToBeRemoved = projectActualState.entities.filter(e => !dbEntities.map(e=>e.id).includes(e.id))
            .map(e=>e.id);
        const dbAttributesIdsToBeRemoved = allAttributeIds.filter(a => !dbAttributes.map(a=>a.id).includes(a));
        const dbConstraintsIdsToBeRemoved = allConstraintIds.filter(c => !dbConstraints.map(c=>c.id).includes(c));
        const dbRelationshipsIdsToBeRemoved = allRelationShipIds.filter(r => !dbRelationships.map(r=>r.id).includes(r));
        try {
            await getRepository(DBProject).save(dbProject);
            await getRepository(DBEntity).save(dbEntities);
            await getRepository(DBAttribute).save(dbAttributes);
            await getRepository(DBConstraint).save(dbConstraints);
            await getRepository(DBRelationship).save(dbRelationships);
            if(dbEntitiesIdsToBeRemoved.length > 0) await getRepository(DBEntity).delete(dbEntitiesIdsToBeRemoved);
            if(dbAttributesIdsToBeRemoved.length > 0) await getRepository(DBAttribute).delete(dbAttributesIdsToBeRemoved);
            if(dbConstraintsIdsToBeRemoved.length > 0) await getRepository(DBConstraint).delete(dbConstraintsIdsToBeRemoved);
            if(dbRelationshipsIdsToBeRemoved.length > 0) await getRepository(DBRelationship).delete(dbRelationshipsIdsToBeRemoved);
        } catch (e) {
            console.log(e);
        }
        return res.status(200).json(config);
    };
}

export default ProjectConfigController;
