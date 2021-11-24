import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from "express";
import { Application, Request, Response } from "express";


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

    try {
        app.listen(port, (): void => {
            console.log(`Connected successfully on port ${port}`);
        });
    } catch (error) {
        console.error(`Error occured: ${error.message}`);
    }

}).catch((error) => console.log(error));
