import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs"
import { getRepository } from "typeorm";
import DBUser from "../entity/DBUser";
import config from "../config";

class AuthController {
    static register = async (req: Request, res: Response)=> {
        let{id, email, username, firstName, lastName, password, age} = req.body;
        if (!(id && email && username && firstName && lastName && password)){
            res.status(400).send();
        }

        const userRepository = getRepository(DBUser);
        if(await userRepository.findOneOrFail({
            where: [
                {username: username},
                {email: username}
            ]
        })){
            res.status(400).send();
        }
        let newUser = new DBUser();
        newUser.id = id;
        newUser.email = email;
        newUser.username = username;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.hashedPassword = bcrypt.hashSync(password, 8);
        newUser.age = age;

        await userRepository.save(newUser);

        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        //Send the jwt in the response
        res.send(token);
    }

    static login = async (req: Request, res: Response) => {
        //Check if username and password are set
        let { username, password } = req.body;
        if (!(username && password)) {
            return res.status(400).send();
        }

        //Get user from database
        const userRepository = getRepository(DBUser);
        let user: DBUser;
        try {
            user = await userRepository.findOne({
                where: [
                    {username: username},
                    {email: username}
                ]
            });
        } catch (error) {
            return res.status(401).send();
        }

        //Check if encrypted password match
        if (!bcrypt.compareSync(password, user.hashedPassword)){
            res.status(401).send();
            return;
        }

        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        //Send the jwt in the response
        return res.send(token);
    };

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            return res.status(400).send();
        }

        //Get user from the database
        const userRepository = getRepository(DBUser);
        let user: DBUser;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send();
        }

        //Check if old password matchs
        if (!bcrypt.compareSync(oldPassword, user.hashedPassword)) {
            res.status(401).send();
            return;
        }

        //Validate de model (password lenght)
        user.hashedPassword = bcrypt.hashSync(newPassword, 8);

        //Hash the new password and save
        await userRepository.save(user);

        res.status(204).send();
    };
}
export default AuthController;
