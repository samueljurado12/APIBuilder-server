import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { Application, Request, Response } from 'express';
import Project from './entity/Project';

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
            const projects: Project[] = await connection.getRepository(Project).find();
            return res.status(200).send({
                projects,
            });
        },
    );

    app.get(
        '/api/project/:id',
        async (req: Request, res: Response): Promise<Response> => {
            const project: Project = await connection.getRepository(Project)
                .findOne({ id: req.params.id });
            if (project) {
                res.status(200).send({
                    project,
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
