import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";
import * as fs from 'fs';
import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";
import {Hero} from "../entity/Hero";
import Uploader from "../utils/Uploader";
import config from "../config/config";

const upload = new Uploader('hero');

const formatHeros = (heros: Hero[]) => {

    return heros.map(hero => {
        return {
            ...hero,
            image: `${config.APP_URL}/uploads/hero/${hero.image}`
        }
    })
}

class HeroController {
    static listAllHero = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const language = req.query.lang !== undefined ? req.query.lang : 'en';
            //Get heros from database
            const heroRepository = getRepository(Hero);
            const heros = await heroRepository.find({
                where: {
                    lang: language
                }
            });

            //Send the heros object
            res.status(200).json(jsonResponse(formatHeros(heros)));
        } catch (err) {
            next(err);
        }
    };

    static getOneHeroById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the hero from database
        const heroRepository = getRepository(Hero);
        try {
            const hero = await heroRepository.findOneOrFail(id);
            res.status(200).json(jsonResponse(hero));
        } catch (error) {
            return next(new ErrorHandler(404, `No hero with id: '${id}`));
        }
    };

    static newHero = async (req: Request, res: Response, next: NextFunction) => {

        //Get parameters from the body
        const imageUploadResponse = await upload.startUpload(req, res, next, 'image');

        let hero = new Hero();
        hero.title = imageUploadResponse.title;
        hero.alternative = imageUploadResponse.alternative;
        hero.image = imageUploadResponse.filename;
        hero.content = imageUploadResponse.content;
        hero.link = imageUploadResponse.link;
        hero.lang = imageUploadResponse.lang;

        // Validate if the parameters are ok
        const errors = await validate(hero);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "Hero validation failed", errors));
        }

        // Try to save. If fails
        const heroRepository = getRepository(Hero);

        try {
            await heroRepository.save(hero);
        } catch (e) {
            return next(new ErrorHandler(409, e.message));
        }

        // If all ok, send 201 response
        res.status(201).json(jsonResponse(hero, 201));
    };

    static editHero = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;


        // Try to find hero in the database
        const heroRepository = getRepository(Hero);
        try {

            const hero = await heroRepository.findOneOrFail(id);

            //Get parameters from the body
            const imageUploadResponse = await upload.startUpload(req, res, next, 'image');

            hero.title = imageUploadResponse.title || hero.title;
            hero.alternative = imageUploadResponse.alternative || hero.alternative;
            hero.image = imageUploadResponse.filename || hero.image;
            hero.content = imageUploadResponse.content || hero.content;
            hero.link = imageUploadResponse.link || hero.link;

            //Validate the new values on model
            const errors = await validate(hero);
            if (errors.length > 0) {
                return next(new ErrorHandler(400, "Hero validation failed", errors));
            }

            await heroRepository.save(hero);

            //After all send a 204 (no content, but accepted) response
            res.status(202).json(jsonResponse({...hero}, 202));
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "Hero not found"));
        }

    };

    static deleteHero = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        //Get the ID from the url
        const id = req.params.id;

        const heroRepository = getRepository(Hero);
        try {
            const hero = await heroRepository.findOneOrFail(id);
            fs.unlinkSync('./public/uploads/hero/' + hero.image);
            await heroRepository.delete(id);
            res.status(202).json(jsonResponse({...hero}, 202));
        } catch (error) {
            return next(new ErrorHandler(404, "Hero not found " + error.message));
        }

    };
}

export default HeroController;
