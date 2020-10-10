import {NextFunction, Request, Response} from "express";

import {jsonResponse} from "../utils/response";


export const checkRequestedLanguage = async (req: Request, res: Response, next: NextFunction) => {

    const availableLanguages = ['en', 'ar', 'fr', 'es'];
    if (req.query.lang !== undefined && !availableLanguages.includes(req.query.lang)) {

        // //If token is not valid, respond with 401 (unauthorized)
        return res.status(401).json(jsonResponse({}, 404));

    }
    req.body.lang = req.query.lang !== undefined ? req.query.lang : 'en';
    //Call the next middleware or controller
    next();
};
