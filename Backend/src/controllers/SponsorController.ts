import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";
import * as fs from 'fs';
import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";
import {Sponsor} from "../entity/Sponsor";
import Uploader from "../utils/Uploader";
import config from "../config/config";

const upload = new Uploader('sponsor');

const formatSponsors = (sponsors: Sponsor[]) => {

    return sponsors.map(sponsor => {
        return {
            ...sponsor,
            image: `${config.APP_URL}/uploads/sponsor/${sponsor.image}`
        }
    })
}

class SponsorController {
    static listAllSponsor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const language = req.query.lang !== undefined ? req.query.lang : 'en';

            //Get sponsors from database
            const sponsorRepository = getRepository(Sponsor);
            const sponsors = await sponsorRepository.find({
                where: {
                    lang: language
                }
            });

            //Send the sponsors object
            res.status(200).json(jsonResponse(formatSponsors(sponsors)));
        } catch (err) {
            next(err);
        }
    };

    static getOneSponsorById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the sponsor from database
        const sponsorRepository = getRepository(Sponsor);
        try {
            const sponsor = await sponsorRepository.findOneOrFail(id);
            res.status(200).json(jsonResponse(sponsor));
        } catch (error) {
            return next(new ErrorHandler(404, `No sponsor with id: '${id}`));
        }
    };

    static newSponsor = async (req: Request, res: Response, next: NextFunction) => {

        //Get parameters from the body
        const imageUploadResponse = await upload.startUpload(req, res, next, 'image');

        let sponsor = new Sponsor();
        sponsor.image_title = imageUploadResponse.image_title;
        sponsor.image_alternative = imageUploadResponse.image_alternative;
        sponsor.image = imageUploadResponse.filename;
        sponsor.title = imageUploadResponse.title;
        sponsor.lang = imageUploadResponse.lang;

        sponsor.content = imageUploadResponse.content;
        sponsor.link = imageUploadResponse.link;

        // Validate if the parameters are ok
        const errors = await validate(sponsor);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "Sponsor validation failed", errors));
        }

        // Try to save. If fails
        const sponsorRepository = getRepository(Sponsor);

        try {
            await sponsorRepository.save(sponsor);
        } catch (e) {
            return next(new ErrorHandler(409, e.message));
        }

        // If all ok, send 201 response
        res.status(201).json(jsonResponse(sponsor, 201));
    };

    static editSponsor = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;


        // Try to find sponsor in the database
        const sponsorRepository = getRepository(Sponsor);
        try {

            const sponsor = await sponsorRepository.findOneOrFail(id);

            //Get parameters from the body
            const imageUploadResponse = await upload.startUpload(req, res, next, 'image');

            sponsor.image_title = imageUploadResponse.image_title || sponsor.image_title;
            sponsor.image_alternative = imageUploadResponse.image_alternative || sponsor.image_alternative;
            sponsor.image = imageUploadResponse.filename || sponsor.image;
            sponsor.title = imageUploadResponse.title || sponsor.title;
            sponsor.content = imageUploadResponse.content || sponsor.content;
            sponsor.link = imageUploadResponse.link || sponsor.link;

            //Validate the new values on model
            const errors = await validate(sponsor);
            if (errors.length > 0) {
                return next(new ErrorHandler(400, "Sponsor validation failed", errors));
            }

            await sponsorRepository.save(sponsor);

            //After all send a 204 (no content, but accepted) response
            res.status(202).json(jsonResponse({...sponsor}, 202));
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "Sponsor not found"));
        }

    };

    static deleteSponsor = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        //Get the ID from the url
        const id = req.params.id;

        const sponsorRepository = getRepository(Sponsor);
        try {
            const sponsor = await sponsorRepository.findOneOrFail(id);
            fs.unlinkSync('./public/uploads/sponsor/' + sponsor.image);
            await sponsorRepository.delete(id);
            res.status(202).json(jsonResponse({...sponsor}, 202));
        } catch (error) {
            return next(new ErrorHandler(404, "Sponsor not found " + error.message));
        }

    };
}

export default SponsorController;
