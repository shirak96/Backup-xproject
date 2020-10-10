import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import {Admin} from "../entity/Admin";

import config from "../config/config";
import {jsonResponse} from "../utils/response";
import {getRepository} from "typeorm";

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    const token = <string>req.headers["auth"];
    let jwtPayload;

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        return res.status(401).json(jsonResponse({}, 401));
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const {adminId, email} = jwtPayload;
    const newToken = jwt.sign({adminId, email}, config.jwtSecret, {
        expiresIn: "12h"
    });
    //Get the user from database
    const adminRepository = getRepository(Admin);
    try {
        //TODO: Replace with session
        // @ts-ignore
        req.user = await adminRepository.findOneOrFail(adminId, {
            select: ["id", "email"] //We don't want to send the password on response
        });
    } catch (error) {
        return res.status(401).json(jsonResponse({}, 401));
    }
    res.setHeader("token", newToken);

    //Call the next middleware or controller
    next();
};
