import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import { Application, Request, Response } from 'express';
import { IProject, IProjectConfig } from 'api-builder-types';
import DBProject from './entity/DBProject';
import Project from './TypeImplementation/Project';
import { parseConfigToDB, parseDBToConfig } from './Helper/DBConfigParser';
import DBUser from './entity/DBUser';
import DBEntity from './entity/DBEntity';
import DBAttribute from './entity/DBAttribute';
import DBConstraint from './entity/DBConstraint';
import DBRelationship from './entity/DBRelationship';
import ExporterFactory from './Helper/Exporter/ExporterFactory';
import GeneratePackage from './Helper/PackageGenerator';
import StringFormatter from './Helper/StringFormatter';

const app: Application = express();
const port = 3000;
const getFullDBProject = async (connection, id): Promise<DBProject> =>
    connection.getRepository(DBProject)
    .findOne({ id },
        {
            relations: ['entities',
                'entities.attributes',
                'entities.relationships',
                'entities.constraints',
            ],
        });

createConnection().then(async (connection) => {
    await connection.synchronize();

    // Body parsing Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get(
        '/api/project/all',
        async (req: Request, res: Response): Promise<Response> => {
            const dbProjects: DBProject[] = await connection.getRepository(DBProject).find();
            const projects : Project[] = dbProjects.map<Project>((dbp) => new Project(dbp));
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
        '/api/project/:id/export',
        async (req: Request, res: Response): Promise<Response> => {
            const dbProject = await getFullDBProject(connection, req.params.id);
            const exporter = ExporterFactory(dbProject);
            if (exporter === null) {
                res.status(501).send('Error: Exporter not implemented for Project Type');
            }
            exporter.export().then((schema) => {
                res.writeHead(200, {
                    'Content-Type': 'text/sql',
                    'Content-disposition': `attachment; filename=${StringFormatter(dbProject.name)}-schema.sql`,
                });
                res.end(schema);
            });
            return res;
        },
    );

    app.get(
        '/api/project/:id/package',
        async (req: Request, res: Response): Promise<Response> => {
            const dbProject = await getFullDBProject(connection, req.params.id);

            GeneratePackage(dbProject).then((base64) => {
                if (base64 === '') {
                    res.status(500)
                        .send('Error: Something went wrong during package generation.');
                    return;
                }
                const zipFile = Buffer.from(base64, 'base64');
                res.writeHead(200, {
                    'Content-Type': 'application/zip',
                    'Content-disposition': `attachment; filename=${StringFormatter(dbProject.name)}.zip`,
                });
                res.end(zipFile);
            });
            return res;
        },
    );

    app.get(
        '/api/projectConfig/:id',
        async (req: Request, res: Response): Promise<Response> => {
            const dbProject = await getFullDBProject(connection, req.params.id);
            if (dbProject) {
                const projectConfig: IProjectConfig = await parseDBToConfig(dbProject);
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
            // TODO Change to current user after adding oauth.
            dbProject.owner = await connection.getRepository(DBUser).findOne();
            try {
                await connection.getRepository(DBProject).save(dbProject);
            } catch (e) {
                console.log(e);
            }
            return res.status(200).json(project);
        },
    );

    app.post(
        '/api/projectConfig',
        async (req: Request, res: Response): Promise<Response> => {
            const config: IProjectConfig = req.body as IProjectConfig;
            const [dbProject, dbEntities, dbAttributes,
                dbConstraints, dbRelationships] = await parseConfigToDB(config, connection);
            try {
                await connection.getRepository(DBProject).save(dbProject);
                await connection.getRepository(DBEntity).save(dbEntities);
                await connection.getRepository(DBAttribute).save(dbAttributes);
                await connection.getRepository(DBConstraint).save(dbConstraints);
                await connection.getRepository(DBRelationship).save(dbRelationships);
            } catch (e) {
                console.log(e);
            }
            return res.status(200).json(config);
        },
    );

    app.delete(
        '/api/project/:id',
        async (req: Request, res: Response): Promise<Response> => {
            await connection.getRepository(DBProject).delete(req.params.id);
            return res.status(200).json({ message: 'Deleted succesfully' });
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
