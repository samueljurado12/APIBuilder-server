import DBProject from "../entity/DBProject";
import {getRepository} from "typeorm";

const getFullDBProject = async (id, userId): Promise<DBProject> =>
    getRepository(DBProject)
        .findOne(
            {
                where: {id:id, owner:userId},
                relations: ['entities',
                    'entities.attributes',
                    'entities.relationships',
                    'entities.constraints',
                ],
            });

export default getFullDBProject;
