import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { Application, Request, Response } from 'express';
import { IProject, IProjectConfig } from 'api-builder-types';
import DBProject from './entity/DBProject';
import Project from './TypeImplementation/Project';
import { parseDBToConfig } from './Helper/DBConfigParser';
import DBUser from "./entity/DBUser";

const app: Application = express();
const port = 3000;

createConnection().then(async (connection) => {
    await connection.synchronize();

    // Body parsing Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get(
        '/api/project/all',
        async (req: Request, res: Response): Promise<Response> => {
            const dbProjects: DBProject[] = await connection.getRepository(DBProject).find();
            const projects : Project[] = [];
            dbProjects.forEach((dbp) => projects.push(new Project(dbp)));
            return res.status(200).send({
                projects,
            });
        },
    );

    app.get(
        '/api/project/:id',
        async (req: Request, res: Response): Promise<Response> => {
            const dbProject: DBProject = await connection.getRepository(DBProject)
                .findOne({ id: req.params.id });
            const project : IProject = new Project(dbProject);
            return res.status(200).json(project);
        },
    );

    app.get(
        '/api/projectConfig/:id',
        async (req: Request, res: Response): Promise<Response> => {
            const dbProject: DBProject = await connection.getRepository(DBProject)
                .findOne({ id: req.params.id },
                    {
                        relations: ['entities',
                            'entities.attributes',
                            'entities.relationships',
                            'entities.constraints',
                        ],
                    });
            if (dbProject) {
                const projectConfig: IProjectConfig = parseDBToConfig(dbProject);
                res.status(200).json(projectConfig);
            } else {
                res.status(404).send({
                    error: `Project with id '${req.params.id}' not found.`,
                });
            }
            return res;
        },
    );

    app.post(
        '/api/project',
        async (req: Request, res: Response): Promise<Response> => {
            const project: IProject = req.body as IProject;
            const dbProject: DBProject = new DBProject();
            dbProject.id = project.Identifier;
            dbProject.name = project.Name;
            dbProject.type = project.Type;
            dbProject.description = project.Description;
            //TODO Change to current user after adding oauth.
            dbProject.owner = await connection.getRepository(DBUser).findOne();
            try {
                await connection.getRepository(DBProject).save(dbProject);
            } catch (e) {
                console.log(e)
            }
            return res.status(200).json(project);
        },
    );

    app.delete(
        'api/project/:id',
        async (req: Request, res: Response): Promise<Response> => {
            await connection.getRepository(DBProject).delete(req.params.id);
            return res.status(200);
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
