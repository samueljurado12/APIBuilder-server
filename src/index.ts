import 'reflect-metadata';
import {createConnection} from 'typeorm';
import * as express from "express";
import { Application, Request, Response } from "express";
import Project from "./entity/Project";
import ResponseProject from "./Response/ResponseProject";
import ResponseProjects from "./Response/ResponseProjects";


const app: Application = express();
const port = 3000;

createConnection().then(async (connection) => {
    await connection.synchronize();

    console.log("Here you can setup and run express/koa/any other framework.");

    // Body parsing Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get(
        "/",
        async (req: Request, res: Response): Promise<Response> => {
            return res.status(200).send({
                message: "Hello World!",
            });
        }
    );

    app.get(
        "/api/project/all",
        async(req: Request, res: Response): Promise<Response> => {
            const dbProjects: Project[] = await connection.getRepository(Project).find();
            const data: ResponseProjects = new ResponseProjects();
            dbProjects.forEach(p => data.projects.push(new ResponseProject(p.id.toString(), p.name, p.type, '')));
            return res.json(data)
        }
    )

    try {
        app.listen(port, (): void => {
            console.log(`Connected successfully on port ${port}`);
        });
    } catch (error) {
        console.error(`Error occured: ${error.message}`);
    }

}).catch((error) => console.log(error));
