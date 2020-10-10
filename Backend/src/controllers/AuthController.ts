import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {Admin} from "../entity/Admin";
import config from "../config/config";
import {ErrorHandler} from "../utils/errors";
import {jsonResponse} from "../utils/response";

class AuthController {
    static login = async (req: Request, res: Response, next: NextFunction) => {
        // Check if email and password are set
        let {email, password} = req.body;

        if (!(email && password)) {
            const errors = [];
            if (!email) {
                errors.push('Email is required');
            }
            if (!password) {
                errors.push('Password is required');
            }
            return next(new ErrorHandler(400, "Invalid email or password", errors));
        }

        // Get user from database
        const adminRepository = getRepository(Admin);
        let admin: Admin;
        try {
            admin = await adminRepository.findOneOrFail({where: {email}});
        } catch (error) {
            return next(
                // For security reasons we don't send a specific error
                new ErrorHandler(
                    404,
                    `Invalid email or password'`
                )
            );
        }

        // Check if encrypted password match
        if (!admin.checkIfUnencryptedPasswordIsValid(password)) {
            return next(new ErrorHandler(400, "Invalid email or passwords"));
        }
        // Sing JWT, valid for 1 hour
        const token = jwt.sign(
            {adminId: admin.id, email: admin.email},
            config.jwtSecret,
            {expiresIn: "12h"}
        );

        res.setHeader("token", token);

        // Send the jwt in the response
        res.status(200).json(
            jsonResponse(
                {
                    token,
                    admin: {...admin, id: undefined, password: undefined}
                },
                200
            )
        );
    };

    static changePassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        // Get ID from JWT
        const id = res.locals.jwtPayload.adminId;

        // Get parameters from the body
        const {oldPassword, newPassword} = req.body;
        if (!(oldPassword && newPassword)) {
            return next(
                new ErrorHandler(400, "Old password and new password are required")
            );
        }

        // Get admin from the database
        const adminRepository = getRepository(Admin);
        let admin: Admin;
        try {
            admin = await adminRepository.findOneOrFail(id);
        } catch (error) {
            return next(new ErrorHandler(404, `Could not find any admin with the following ID: ${id}`));
        }

        // Check if old password matches
        if (!admin.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            return next(new ErrorHandler(401, "Wrong old password"));
        }

        // Validate de model (password length)
        admin.password = newPassword;
        const errors = await validate(admin);
        if (errors.length > 0) {
            return next(new ErrorHandler(401, "Admin validation failed", errors));
        }
        // Hash the new password and save
        admin.hashPassword();
        await adminRepository.save(admin);

        res.json(
            jsonResponse(
                {
                    ...admin,
                    id: undefined,
                    password: undefined
                },
                204
            )
        );
    };

    static authenticate = (req: Request, res: Response) => {
        // TODO: replace with getting variable from session
        // @ts-ignore
        res.status(202).json(jsonResponse({admin: req.admin}, 202))
    }
}

export default AuthController;
