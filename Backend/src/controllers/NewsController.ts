import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";
import {News} from "../entity/News";

class NewsController {
    static listAllNews = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const language = req.query.lang !== undefined ? req.query.lang : 'en';

            //Get news from database
            const newsRepository = getRepository(News);
            const newsData = await newsRepository.find({
                where: {
                    lang: language
                }
            });
            //Send the news object
            res.status(200).json(jsonResponse(newsData));
        } catch (err) {
            next(err);
        }
    };

    static getOneNewsById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the news from database
        const newsRepository = getRepository(News);
        try {
            const news = await newsRepository.findOneOrFail(id);
            res.status(200).json(jsonResponse(news));
        } catch (error) {
            return next(new ErrorHandler(404, `No news with id: '${id}`));
        }
    };

    static newNews = async (req: Request, res: Response, next: NextFunction) => {

        //Get parameters from the body
        let {name, date, content, type, lang} = req.body;

        let news = new News();
        news.name = name;
        news.content = content;
        news.date = date;
        news.type = type;
        news.lang = lang;

        // Validate if the parameters are ok
        const errors = await validate(news);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "News validation failed", errors));
        }

        // Try to save. If fails
        const newsRepository = getRepository(News);

        try {
            await newsRepository.save(news);
        } catch (e) {
            return next(new ErrorHandler(409, e.message));
        }

        // If all ok, send 201 response
        res.status(201).json(jsonResponse(news, 201));
    };

    static editNews = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get parameters from the body
        let {name, date, content, type} = req.body;

        // Try to find news in the database
        const newsRepository = getRepository(News);
        try {

            const news = await newsRepository.findOneOrFail(id);

            news.name = name || news.name;
            news.content = content || news.content;
            news.date = date || news.date;
            news.type = type || news.type;

            //Validate the new values on model
            const errors = await validate(news);
            if (errors.length > 0) {
                return next(new ErrorHandler(400, "News validation failed", errors));
            }

            await newsRepository.save(news);

            //After all send a 204 (no content, but accepted) response
            res.status(202).json(jsonResponse({...news}, 202));
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "News not found"));
        }

    };

    static deleteNews = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        //Get the ID from the url
        const id = req.params.id;

        const newsRepository = getRepository(News);
        try {
            const news = await newsRepository.findOneOrFail(id);
            await newsRepository.delete(id);
            res.status(202).json(jsonResponse({...news}, 202));
        } catch (error) {
            return next(new ErrorHandler(404, "News not found " + error.message));
        }

    };
}

export default NewsController;
