import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {Admin} from "../entity/Admin";
import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";

class AdminController {
    static listAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //Get admins from database
            const adminRepository = getRepository(Admin);
            const admins = await adminRepository.find({
                select: ["id", "full_name", "username", "email", "createdAt", "updatedAt"] //We don't want to send the passwords on response
            });
            //Send the admins object
            res.status(200).json(jsonResponse(admins));
        } catch (error) {
            error.statusCode = 500;
            next(error);
        }
    };

    static getOneAdminById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: number = parseInt(req.params.id);

        //Get the admin from database
        const adminRepository = getRepository(Admin);
        try {
            const admin = await adminRepository.findOneOrFail(id, {
                select: ["id", "full_name", "username", "email", "createdAt", "updatedAt"] //We don't want to send the passwords on response
            });
            res.status(200).json(jsonResponse(admin));
        } catch (error) {
            return next(new ErrorHandler(404, `Could not find any admin with the following ID: ${id}`));
        }
    };

    static newAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {full_name, username, password, email} = req.body;
            //Get the admin from database
            const adminRepository = getRepository(Admin);
            const admin = new Admin();
            admin.full_name = full_name;
            admin.username = username;
            admin.password = password;
            admin.email = email;

            const errors = await validate(admin);

            if (errors.length > 0) {
                return next(new ErrorHandler(400, "Admin validation failed", errors));
            }
            //Hash the new password and save
            admin.hashPassword();
            await adminRepository.save(admin);
            res.json(
                jsonResponse(
                    {
                        ...admin,
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

    static editAdmin = async (req: Request, res: Response, next: NextFunction) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const {full_name, username, password} = req.body;

        //Try to find admin on database
        const adminRepository = getRepository(Admin);
        let admin;
        try {
            admin = await adminRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "Admin not found"));
        }

        //Validate the new values on model
        admin.full_name = full_name;
        admin.username = username;
        if (typeof password !== 'undefined' && password.trim() !== '') {
            admin.password = password;
        }
        const errors = await validate(admin);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "Admin validation failed", errors));
        }

        if (typeof password !== 'undefined' && password.trim() !== '') {
            admin.hashPassword();
        }
        //Try to save, if fails, that means username already in use
        try {
            await adminRepository.save(admin);
        } catch (e) {
            return next(new ErrorHandler(409, "username already in use"));
        }
        res
            .status(202)
            .json(jsonResponse({...admin, id: undefined, password: undefined}, 202));
    };

    static deleteAdmin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id = req.params.id;

        const adminRepository = getRepository(Admin);
        let admin: Admin;
        try {
            admin = await adminRepository.findOneOrFail(id);
        } catch (error) {
            return next(new ErrorHandler(404, "Admin not found"));
        }

        await adminRepository.delete(id);

        res.status(202).json(
            jsonResponse(
                {
                    ...admin
                },
                202
            )
        );
    };
}

export default AdminController;
