import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";
import * as fs from 'fs';
import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";
import {Newspaper} from "../entity/Newspaper";
import Uploader from "../utils/Uploader";
import config from "../config/config";

const upload = new Uploader('newsletter');

const formatNewsPapers = (newspapers: Newspaper[]) => {

    return newspapers.map(newspaper => {
        return {
            ...newspaper,
            image: `${config.APP_URL}/uploads/newsletter/${newspaper.image}`
        }
    })
}

class NewspaperController {
    static listAllNewspaper = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const language = req.query.lang !== undefined ? req.query.lang : 'en';

            //Get newspapers from database
            const newspaperRepository = getRepository(Newspaper);
            const newspapers = await newspaperRepository.find();

            //Send the newspapers object
            res.status(200).json(jsonResponse(formatNewsPapers(newspapers)));
        } catch (err) {
            next(err);
        }
    };

    static getOneNewspaperById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the newspaper from database
        const newspaperRepository = getRepository(Newspaper);
        try {
            const newspaper = await newspaperRepository.findOneOrFail(id);
            res.status(200).json(jsonResponse(newspaper));
        } catch (error) {
            return next(new ErrorHandler(404, `No newspaper with id: '${id}`));
        }
    };

    static newNewspaper = async (req: Request, res: Response, next: NextFunction) => {

        //Get parameters from the body
        const imageUploadResponse = await upload.startUpload(req, res, next, 'image');

        let newspaper = new Newspaper();
        newspaper.title = imageUploadResponse.title;
        newspaper.alternative = imageUploadResponse.alternative;
        newspaper.image = imageUploadResponse.filename;
        // newspaper.lang = imageUploadResponse.lang;

        // Validate if the parameters are ok
        const errors = await validate(newspaper);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "Newspaper validation failed", errors));
        }

        // Try to save. If fails
        const newspaperRepository = getRepository(Newspaper);

        try {
            await newspaperRepository.save(newspaper);
        } catch (e) {
            return next(new ErrorHandler(409, e.message));
        }

        // If all ok, send 201 response
        res.status(201).json(jsonResponse(newspaper, 201));
    };

    static editNewspaper = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;


        // Try to find newspaper in the database
        const newspaperRepository = getRepository(Newspaper);
        try {

            const newspaper = await newspaperRepository.findOneOrFail(id);

            //Get parameters from the body
            const imageUploadResponse = await upload.startUpload(req, res, next, 'image');

            newspaper.title = imageUploadResponse.title || newspaper.title;
            newspaper.alternative = imageUploadResponse.alternative || newspaper.alternative;
            newspaper.image = imageUploadResponse.filename || newspaper.image;

            //Validate the new values on model
            const errors = await validate(newspaper);
            if (errors.length > 0) {
                return next(new ErrorHandler(400, "Newspaper validation failed", errors));
            }

            await newspaperRepository.save(newspaper);

            //After all send a 204 (no content, but accepted) response
            res.status(202).json(jsonResponse({...newspaper}, 202));
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "Newspaper not found"));
        }

    };

    static deleteNewspaper = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        //Get the ID from the url
        const id = req.params.id;

        const newspaperRepository = getRepository(Newspaper);
        try {
            const newspaper = await newspaperRepository.findOneOrFail(id);
            fs.unlinkSync('./public/uploads/newsletter/'+ newspaper.image);
            await newspaperRepository.delete(id);
            res.status(202).json(jsonResponse({...newspaper}, 202));
        } catch (error) {
            return next(new ErrorHandler(404, "Newspaper not found " + error.message));
        }

    };
}

export default NewspaperController;
