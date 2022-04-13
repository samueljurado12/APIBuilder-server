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
        try {
            await getRepository(DBProject).save(dbProject);
            await getRepository(DBEntity).save(dbEntities);
            await getRepository(DBAttribute).save(dbAttributes);
            await getRepository(DBConstraint).save(dbConstraints);
            await getRepository(DBRelationship).save(dbRelationships);
        } catch (e) {
            console.log(e);
        }
        return res.status(200).json(config);
    };
}

export default ProjectConfigController;
