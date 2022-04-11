import { getRepository } from 'typeorm';
import DBProject from '../entity/DBProject';

const getFullDBProject = async (id, userId): Promise<DBProject> => getRepository(DBProject)
    .findOne(
        {
            where: { id, owner: userId },
            relations: ['entities',
                'entities.attributes',
                'entities.relationships',
                'entities.constraints',
            ],
        },
    );

export default getFullDBProject;
