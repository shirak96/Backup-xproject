import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";
import {CalendarEvent} from "../entity/CalendarEvent";
import {CalendarHero} from "../entity/CalendarHero";
import Uploader from "../utils/Uploader";

import config from "../config/config";
import * as fs from 'fs'

const calendarEventUpload = new Uploader('calendar_events');
const calendarHeroUpload = new Uploader('calendar_heroes');


const formatCalendarHero = (calendarHero: CalendarHero) => {
    return {
        ...calendarHero,
        imageSrc: `${config.APP_URL}/uploads/calendar_heroes/${calendarHero.imageSrc}`
    }
}
const formatCalendarHeroes = (calendarHeroes: CalendarHero[]) => {

    return calendarHeroes.map(calendarHero => {
        return calendarHero;
    })
}

const formatCalendarEvent = (calendarEvent: CalendarEvent) => {
    return {
        ...calendarEvent,
        image: `${config.APP_URL}/uploads/calendar_events/${calendarEvent.imageSrc}`
    }
}

const formatCalendarEvents = (calendarEvents: CalendarEvent[]) => {

    return calendarEvents.map(calendarEvent => {
        return calendarEvent;
    })
}

class MapCalendarController {


    static listAllCalendarEventsAndHeroes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const language = req.query.lang !== undefined ? req.query.lang : 'en';
            //Get calendar events from database
            const calendarEventRepository = getRepository(CalendarEvent);
            const calendarEvents = await calendarEventRepository.find({
                where: {
                    lang: language
                }
            });

            //Get calendar heroes from database
            const calendarHeroRepository = getRepository(CalendarHero);
            const calendarHeroes = await calendarHeroRepository.find({
                where: {
                    lang: language
                }
            });

            const allData = {
                events: calendarEvents,
                heroes: calendarHeroes,
            }
            //Send the calendar events object
            res.status(200).json(jsonResponse(allData));
        } catch (err) {
            next(err);
        }
    }



    //--------------------EVENTS------------------------
    // static listAllCalendarEvents = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const language = req.query.lang !== undefined ? req.query.lang : 'en';
    //         //Get calendar events from database
    //         const calendarEventRepository = getRepository(CalendarEvent);
    //         const calendarEvents = await calendarEventRepository.find({
    //             where: {
    //                 lang: language
    //             }
    //         });

    //         //Send the calendar events object
    //         res.status(200).json(jsonResponse(calendarEvents));
    //     } catch (err) {
    //         next(err);
    //     }
    // };

    static getOneCalendarEventById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the calendar event from database
        const calendarEventRepository = getRepository(CalendarEvent);
        try {
            const calendarEvent = await calendarEventRepository.findOneOrFail(id);
            res.status(200).json(jsonResponse(calendarEvent));
        } catch (error) {
            return next(new ErrorHandler(404, `No calendar event with id: '${id}`));
        }
    };

    static newCalendarEvent = async (req: Request, res: Response, next: NextFunction) => {

        //Get parameters from the body
        // const imageUploadResponse = await calendarEventUpload.startUpload(req, res, next, 'calendar_events');

        const imageUploadResponse = req.body;

        let calendarEvent = new CalendarEvent();
        calendarEvent.x_pos = imageUploadResponse.x_pos;
        calendarEvent.y_pos = imageUploadResponse.y_pos;
        calendarEvent.imageSrc = imageUploadResponse.imageSrc;
        calendarEvent.title = imageUploadResponse.title;
        calendarEvent.location = imageUploadResponse.location;
        calendarEvent.date = imageUploadResponse.date;
        calendarEvent.description = imageUploadResponse.description;
        calendarEvent.lang = imageUploadResponse.lang;

        // Validate if the parameters are ok
        const errors = await validate(calendarEvent);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "Calendar Event validation failed", errors));
        }

        // Try to save. If fails
        const calendarEventRepository = getRepository(CalendarEvent);

        try {
            await calendarEventRepository.save(calendarEvent);
        } catch (e) {
            return next(new ErrorHandler(409, e.message));
        }

        // If all ok, send 201 response
        res.status(201).json(jsonResponse(calendarEvent, 201));
    };

    static editCalendarEvent = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Try to find calendar event in the database
        const calendarEventRepository = getRepository(CalendarEvent);
        try {

            const calendarEvent = await calendarEventRepository.findOneOrFail(id);

            //Get parameters from the body
            // const imageUploadResponse = await calendarEventUpload.startUpload(req, res, next, 'image');

            const imageUploadResponse = req.body;

            calendarEvent.x_pos = imageUploadResponse.x_pos || calendarEvent.x_pos;
            calendarEvent.y_pos = imageUploadResponse.y_pos || calendarEvent.y_pos;
            calendarEvent.imageSrc = imageUploadResponse.imageSrc || calendarEvent.imageSrc;
            calendarEvent.title = imageUploadResponse.title || calendarEvent.title;
            calendarEvent.location = imageUploadResponse.location || calendarEvent.location;
            calendarEvent.date = imageUploadResponse.date || calendarEvent.date;
            calendarEvent.description = imageUploadResponse.description || calendarEvent.description;

            //Validate the new values on model
            const errors = await validate(calendarEvent);
            if (errors.length > 0) {
                return next(new ErrorHandler(400, "Calendar Event validation failed", errors));
            }

            await calendarEventRepository.save(calendarEvent);

            //After all send a 204 (no content, but accepted) response
            res.status(202).json(jsonResponse(calendarEvent, 202));
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "Calendar Event not found"));
        }

    };

    static deleteCalendarEvent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        //Get the ID from the url
        const id = req.params.id;

        const calendarEventRepository = getRepository(CalendarEvent);
        try {
            const calendarEvent = await calendarEventRepository.findOneOrFail(id);
            // fs.unlinkSync('./public/uploads/calendar_events/' + calendarEvent.imageSrc);
            await calendarEventRepository.delete(id);
            res.status(202).json(jsonResponse(calendarEvent, 202));
        } catch (error) {
            return next(new ErrorHandler(404, "Calendar Event not found " + error.message));
        }

    };


    //--------------------HEROES------------------------

    // static listAllCalendarHeroes = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const language = req.query.lang !== undefined ? req.query.lang : 'en';
    //         //Get calendar heroes from database
    //         const calendarHeroRepository = getRepository(CalendarHero);
    //         const calendarHeroes = await calendarHeroRepository.find({
    //             where: {
    //                 lang: language
    //             }
    //         });

    //         //Send the calendar heroes object
    //         res.status(200).json(jsonResponse(calendarHeroes));
    //     } catch (err) {
    //         next(err);
    //     }
    // };

    static getOneCalendarHeroById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the calendar hero from database
        const calendarHeroRepository = getRepository(CalendarHero);
        try {
            const calendarHero = await calendarHeroRepository.findOneOrFail(id);
            res.status(200).json(jsonResponse(calendarHero));
        } catch (error) {
            return next(new ErrorHandler(404, `No calendar hero with id: '${id}`));
        }
    };

    static newCalendarHero = async (req: Request, res: Response, next: NextFunction) => {

        //Get parameters from the body
        const imageUploadResponse = await calendarHeroUpload.startUpload(req, res, next, 'calendar_heroes');

        let calendarHero = new CalendarHero();
        calendarHero.x_pos = imageUploadResponse.x_pos;
        calendarHero.y_pos = imageUploadResponse.y_pos;
        calendarHero.imageSrc = imageUploadResponse.filename;
        calendarHero.heroName = imageUploadResponse.heroName;
        calendarHero.website = imageUploadResponse.website;
        calendarHero.description = imageUploadResponse.description;
        calendarHero.lang = imageUploadResponse.lang;

        // Validate if the parameters are ok
        const errors = await validate(calendarHero);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "Calendar Hero validation failed", errors));
        }

        // Try to save. If fails
        const calendarHeroRepository = getRepository(CalendarHero);

        try {
            await calendarHeroRepository.save(calendarHero);
        } catch (e) {
            return next(new ErrorHandler(409, e.message));
        }

        // If all ok, send 201 response
        res.status(201).json(jsonResponse(calendarHero, 201));
    };

    static editCalendarHero = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;


        // Try to find calendar hero in the database
        const calendarHeroRepository = getRepository(CalendarHero);
        try {

            const calendarHero = await calendarHeroRepository.findOneOrFail(id);

            //Get parameters from the body
            const imageUploadResponse = await calendarHeroUpload.startUpload(req, res, next, 'image');

            calendarHero.x_pos = imageUploadResponse.x_pos || calendarHero.x_pos;
            calendarHero.y_pos = imageUploadResponse.y_pos || calendarHero.y_pos;
            calendarHero.imageSrc = imageUploadResponse.filename || calendarHero.imageSrc;
            calendarHero.heroName = imageUploadResponse.heroName || calendarHero.heroName;
            calendarHero.website = imageUploadResponse.website || calendarHero.website;
            calendarHero.description = imageUploadResponse.description || calendarHero.description;

            //Validate the new values on model
            const errors = await validate(calendarHero);
            if (errors.length > 0) {
                return next(new ErrorHandler(400, "Calendar Hero validation failed", errors));
            }

            await calendarHeroRepository.save(calendarHero);

            //After all send a 204 (no content, but accepted) response
            res.status(202).json(jsonResponse(calendarHero, 202));
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "Calendar Hero not found"));
        }

    };

    static deleteCalendarHero = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        //Get the ID from the url
        const id = req.params.id;

        const calendarHeroRepository = getRepository(CalendarHero);
        try {
            const calendarHero = await calendarHeroRepository.findOneOrFail(id);
            // fs.unlinkSync('./public/uploads/calendar_heroes/' + calendarHero.imageSrc);
            await calendarHeroRepository.delete(id);
            res.status(202).json(jsonResponse(calendarHero, 202));
        } catch (error) {
            return next(new ErrorHandler(404, "Calendar Hero not found " + error.message));
        }

    };
}

export default MapCalendarController;
