import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";
import {Setting} from "../entity/Setting";

class SettingController {

    static updateSetting = async (key: string, value: string) => {
        const settingRepository = getRepository(Setting);
        try {
            const setting = await settingRepository.findOne({where: {key: key}});
            if (setting === undefined) {
                let setting = new Setting();
                setting.key = key;
                setting.value = value;

                // Validate if the parameters are ok
                const errors = await validate(setting);
                if (errors.length > 0) {
                    return false;
                }

                try {
                     await settingRepository.save(setting);
                     return setting;
                } catch (e) {
                    return false;
                }
            } else {
                setting.value = value || setting.value;
                //Validate the new values on model
                const errors = await validate(setting);
                if (errors.length > 0) {
                    return false;
                }

                 await settingRepository.save(setting);
                return setting;
            }

        } catch (error) {
            return false;
        }
    }

    static getSetting = async (key: string) : Promise<Setting> => {
        const settingRepository = getRepository(Setting);
        try {
            return await settingRepository.findOne({where: {key: key}});

        } catch (error) {
            return new Promise<undefined>(function(resolve, reject) {
                // the function is executed automatically when the promise is constructed

                // after 1 second signal that the job is done with the result "done"
                resolve(undefined)
            });;
        }
    }
    static listAllSetting = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //Get setting from database
            const settingRepository = getRepository(Setting);
            const settingData = await settingRepository.find();
            //Send the setting object
            res.status(200).json(jsonResponse(settingData));
        } catch (err) {
            next(err);
        }
    };

    static getOneSettingById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const id: string = req.params.id;

        //Get the setting from database
        const settingRepository = getRepository(Setting);
        try {
            const setting = await settingRepository.findOneOrFail(id);
            res.status(200).json(jsonResponse(setting));
        } catch (error) {
            return next(new ErrorHandler(404, `No setting with id: '${id}`));
        }
    };

    static searchForSettings = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        //Get the ID from the url
        const key: string = req.query.key;
        //Get the setting from database
        const settingRepository = getRepository(Setting);
        try {
            const settings = await settingRepository.find({
                where: {key}
            });
            res.status(200).json(jsonResponse(settings));
        } catch (error) {
            return next(new ErrorHandler(404, `No setting with key: '${key}`));
        }
    };

    static newSetting = async (req: Request, res: Response, next: NextFunction) => {

        //Get parameters from the body
        let {key, value, label} = req.body;

        let setting = new Setting();
        setting.key = key;
        setting.value = value;
        setting.label = label;

        // Validate if the parameters are ok
        const errors = await validate(setting);
        if (errors.length > 0) {
            return next(new ErrorHandler(400, "Setting validation failed", errors));
        }

        // Try to save. If fails
        const settingRepository = getRepository(Setting);

        try {
            await settingRepository.save(setting);
        } catch (e) {
            return next(new ErrorHandler(409, e.message));
        }

        // If all ok, send 201 response
        res.status(201).json(jsonResponse(setting, 201));
    };

    static editSetting = async (req: Request, res: Response, next: NextFunction) => {
        // Get the ID from the url
        const id = req.params.id;

        // Get parameters from the body
        let {key, value, label} = req.body;

        console.log('req.body', req.body);
        // Try to find setting in the database
        const settingRepository = getRepository(Setting);
        try {

            const setting = await settingRepository.findOneOrFail(id);

            setting.key = key || setting.key;
            setting.value = value || setting.value;
            setting.label = label || setting.label;

            //Validate the new values on model
            const errors = await validate(setting);
            if (errors.length > 0) {
                return next(new ErrorHandler(400, "Setting validation failed", errors));
            }

            await settingRepository.save(setting);

            //After all send a 204 (no content, but accepted) response
            res.status(202).json(jsonResponse({...setting}, 202));
        } catch (error) {
            //If not found, send a 404 response
            return next(new ErrorHandler(404, "Setting not found"));
        }

    };

    static deleteSetting = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        //Get the ID from the url
        const id = req.params.id;

        const settingRepository = getRepository(Setting);
        try {
            const setting = await settingRepository.findOneOrFail(id);
            await settingRepository.delete(id);
            res.status(202).json(jsonResponse({...setting}, 202));
        } catch (error) {
            return next(new ErrorHandler(404, "Setting not found " + error.message));
        }

    };

}

export default SettingController;
