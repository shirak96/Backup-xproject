import {Request, Response, NextFunction} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {User} from "../entity/User";
import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";

class UserController {
    static listAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //Get users from database
            const userRepository = getRepository(User);
            const users = await userRepository.find();
            //Send the users object
            res.status(200).json(jsonResponse(users));
        } catch (err) {
            next(err);
        }
    };

    static getOneUserById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: number = parseInt(req.params.id);

        //Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id);
            res.status(200).json(jsonResponse(user));
        } catch (error) {
            error.statusCode = "404";
            next(error);
        }
    };

    static newUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {full_name, email} = req.body;
            //Get the user from database
            const userRepository = getRepository(User);
            const user = new User();
            user.full_name = full_name;
            user.email = email;

            const errors = await validate(user);

            if (errors.length > 0) {
                return next(new ErrorHandler(400, "User validation failed", errors));
            }
            //Hash the new password and save
            await userRepository.save(user);
            res.json(
                jsonResponse(
                    {
                        ...user,
                        password: undefined
                    },
                    201
                )
            );
        } catch (error) {
            error.statusCode = 500;
            next(error);
        }
    };

    static editUser = async (req: Request, res: Response, next: NextFunction) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const {full_name, first_name, last_name, address} = req.body;

        //Try to find user on database
        const userRepository = getRepository(User);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "User not found"));
        }

        //Validate the new values on model
        user.full_name = full_name;
        user.first_name = first_name;
        user.last_name = last_name;
        user.address = address;

        const errors = await validate(user);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "User validation failed", errors));
        }

        //Try to save, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            return next(new ErrorHandler(409, "Email already in use"));
        }
        res
            .status(202)
            .json(jsonResponse({...user, password: undefined}, 202));
    };

    static deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id = req.params.id;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            return next(new ErrorHandler(404, "User not found"));
        }

        await userRepository.delete(id);

        res.status(202).json(
            jsonResponse(
                {
                    ...user
                },
                202
            )
        );
    };
}

export default UserController;
