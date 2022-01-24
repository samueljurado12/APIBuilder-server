import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { Application, Request, Response } from 'express';
import DBProject from './entity/DBProject';
import Project from "./TypeImplementation/Project";
import ProjectConfig from "./TypeImplementation/ProjectConfig";

const app: Application = express();
const port = 3000;

createConnection().then(async (connection) => {
    await connection.synchronize();

    // Body parsing Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get(
        '/',
        async (req: Request, res: Response): Promise<Response> => res.status(200).send({
            message: 'Hello World!',
        }),
    );

    app.get(
        '/api/project/all',
        async (req: Request, res: Response): Promise<Response> => {
            const dbProjects: DBProject[] = await connection.getRepository(DBProject).find();
            let projects : Project[] = []
            dbProjects.forEach(dbp => projects.push(new Project(dbp)))
            return res.status(200).send({
                projects,
            });
        },
    );

    app.get(
        '/api/project/:id',
        async (req: Request, res: Response): Promise<Response> => {
            const dbProject: DBProject = await connection.getRepository(DBProject)
                .findOne({ id: req.params.id },
                    {
                        relations: ["entities", "entities.attributes", "entities.relationships"]
                    });
            if (dbProject) {
                let projectConfig: ProjectConfig = new ProjectConfig()
                res.status(200).send({
                    dbProject,
                });
            } else {
                res.status(404).send({
                    error: `Project with id '${req.params.id}' not found.`,
                });
            }
            return res;
        },
    );

    try {
        app.listen(port, (): void => {
            console.log(`Connected successfully on port ${port}`);
        });
    } catch (error) {
        console.error(`Error occured: ${error.message}`);
    }
}).catch((error) => console.log(error));
