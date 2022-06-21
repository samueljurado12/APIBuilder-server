import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { IProject } from 'api-builder-types';
import DBProject from '../entity/DBProject';
import Project from '../TypeImplementation/Project';
import ExporterFactory from '../Helper/Exporter/ExporterFactory';
import StringFormatter from '../Helper/StringFormatter';
import getFullDBProject from '../Helper/GetFullDBProject';
import GeneratePackage from '../Helper/PackageGenerator';
import DBUser from '../entity/DBUser';
import ProjectValidator from "../Validator/ProjectValidator";

class ProjectController {


    static all = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = res.locals.jwtPayload
        const dbProjects: DBProject[] = await getRepository(DBProject)
            .find({ where: { owner: userId } });
        const projects : Project[] = dbProjects.map<Project>((dbp) => new Project(dbp));
        return res.status(200).send({
            projects,
        });
    };

    static id = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = res.locals.jwtPayload;
        const dbProject: DBProject = await getRepository(DBProject)
            .findOneOrFail({ where: { id: req.params.id, owner: userId } });
        const project : IProject = new Project(dbProject);
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).send({
                error: `Project with id '${req.params.id}' not found.`,
            });
        }
        return res;
    };

    static export = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = res.locals.jwtPayload;
        const dbProject = await getFullDBProject(req.params.id, userId);
        if (!dbProject) {
            return res.status(404).send({
                error: `Project with id '${req.params.id}' not found.`,
            });
        }
        const validation = ProjectValidator.validate(dbProject);
        if(!validation.isOk){
            return res.status(400).send({
                message: "Please, fix the following errors before exporting the project",
                errors: validation.errorMessages
            });
        }

        const exporter = ExporterFactory(dbProject);
        if (exporter === null) {
            res.status(501).send('Error: Exporter not implemented for Project Type');
        }
        exporter.export(dbProject).then((schema) => {
            res.writeHead(200, {
                'Content-Type': 'text/sql',
                'Content-disposition': `attachment; filename=${StringFormatter(dbProject.name)}-schema.sql`,
            });
            res.end(schema);
        });
        return res;
    };

    static package = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = res.locals.jwtPayload;
        const dbProject = await getFullDBProject(req.params.id, userId);
        if (!dbProject) {
            return res.status(404).send({
                error: `Project with id '${req.params.id}' not found.`,
            });
        }

        const validation = ProjectValidator.validate(dbProject);
        if(!validation.isOk){
            return res.status(400).send({
                message: "Please, fix the following errors before exporting the project",
                errors: validation.errorMessages
            });
        }

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
    };

    static newProject = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = res.locals.jwtPayload;
        const project: IProject = req.body as IProject;
        const dbProject: DBProject = new DBProject();
        dbProject.id = project.Identifier;
        dbProject.name = project.Name;
        dbProject.type = project.Type;
        dbProject.description = project.Description;
        dbProject.owner = await getRepository(DBUser).findOne({ where: { id: userId } });
        try {
            await getRepository(DBProject).save(dbProject);
        } catch (e) {
            console.log(e);
        }
        return res.status(200).json(project);
    };

    static delete = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = res.locals.jwtPayload;
        const dbProject = await getRepository(DBProject).findOneOrFail({
            where: {
                id: req.params.id,
                owner: userId,
            },
        });
        if (!dbProject) {
            return res.status(404).send({
                error: `Project with id '${req.params.id}' not found.`,
            });
        }
        await getRepository(DBProject).delete(dbProject.id);
        return res.status(200).json({ message: 'Deleted successfully' });
    };
}

export default ProjectController;
