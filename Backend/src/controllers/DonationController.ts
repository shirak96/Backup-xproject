import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";
import {Donation} from "../entity/Donation";
import {User} from "../entity/User";

class DonationController {
    static listAllDonations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //Get donations from database
            const donationRepository = getRepository(Donation);
            const donations = await donationRepository.find({ relations: ["user"] });
            const fullDonationsInfo = donations.map(donation => {
                // console.log('donation', donation.user)
                return {
                    ...donation,
                    full_name: donation.user.full_name,
                    email: donation.user.email,
                    user: undefined
                }
            })
            //Send the donations object
            res.status(200).json(jsonResponse(fullDonationsInfo));
        } catch (error) {
            error.statusCode = 500;
            next(error);
        }
    };

    static getOneDonationById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the donation from database
        const donationRepository = getRepository(Donation);
        try {
            const donation = await donationRepository.findOneOrFail(id);
            res.status(200).json(jsonResponse(donation));
        } catch (error) {
            return next(new ErrorHandler(404, `No donation with id: '${id}`));
        }
    };

    static newDonation = async (req: Request, res: Response, next: NextFunction) => {

        //Get parameters from the body

        //Get parameters from the body
        const {transaction_id, type, full_name, email, about} = req.body;
        const userRepository = getRepository(User);
        let user;
        try {
            user = await userRepository.findOneOrFail({email: email});
            user.full_name = full_name || user.full_name;
            user.email = email || user.email;

        } catch (error) {
            user = new User();
            user.full_name = full_name;
            user.email = email;

            await userRepository.save(user);
            user = await userRepository.findOneOrFail({email: email});
        }

        const errors_user = await validate(user);

        if (errors_user.length > 0) {
            return next(new ErrorHandler(400, "User validation failed", errors_user));
        }

        let donation = new Donation();
        donation.transaction_id = transaction_id;
        donation.type = type;
        donation.user = user;
        donation.about = about;

        // Validate if the parameters are ok
        const errors = await validate(donation);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "Donation validation failed", errors));
        }

        // Try to save. If fails
        const donationRepository = getRepository(Donation);

        try {
            await donationRepository.save(donation);
        } catch (e) {
            return  next(new ErrorHandler(409, e.message));
        }

        // If all ok, send 201 response
        res.status(201).json(jsonResponse({donation, user}, 201));
    };

    static editDonation = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get parameters from the body
        let {transaction_id, type, user_id} = req.body;

        // Try to find donation in the database
        const donationRepository = getRepository(Donation);
        try {
            const donation = await donationRepository.findOneOrFail(id);

            donation.transaction_id = transaction_id || donation.transaction_id;
            donation.type = type || donation.type;

            //Validate the new values on model
            const errors = await validate(donation);
            if (errors.length > 0) {
                return next(new ErrorHandler(400, "Donation validation failed", errors));
            }

            //Try to safe, if fails, that means transaction_id already in use
            try {
                await donationRepository.save(donation);
            } catch (e) {
                return next(new ErrorHandler(409, "transaction_id already in use"));
            }
            //After all send a 204 (no content, but accepted) response
            res.status(202).json(jsonResponse({...donation}, 202));
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "Donation not found"));
        }

    };

    static deleteDonation = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id = req.params.id;

        const donationRepository = getRepository(Donation);
        try {
            let donation: Donation;

            donation = await donationRepository.findOneOrFail(id);

            await donationRepository.delete(id);

            res.status(202).json(jsonResponse({...donation}, 202));
        } catch (error) {
            return next(new ErrorHandler(404, "Donation not found " + error.message));
        }

    };
}

export default DonationController;
