import 'reflect-metadata';
import { createConnection } from 'typeorm';
import User from './entity/User';

createConnection().then(async (connection) => {

    // console.log("Here you can setup and run express/koa/any other framework.");

}).catch((error) => console.log(error));
