import {Request, Response, NextFunction} from "express";
import {getRepository} from "typeorm";
import {jsonResponse} from "../utils/response";
import {ErrorHandler} from "../utils/errors";
import {Setting} from "../entity/Setting";
import SettingController from "./SettingController";
import {
    getInstagramLatestPosts
} from "../services/insta-graph-api";

class InstagramGraphApiController {



    static listLatestInstaPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const insta_page_long_access_token = await SettingController.getSetting('insta_page_long_access_token');
            const insta_page_id = await SettingController.getSetting('insta_page_id');

            if (insta_page_long_access_token !== undefined && insta_page_id !== undefined) {
                // @ts-ignore
                const data = await getInstagramLatestPosts(insta_page_long_access_token.value)
                res.status(200).json(jsonResponse(data))
            }
        } catch (err) {
            err.status = 500;
            err.statusCode = 500;
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

}

export default InstagramGraphApiController;
