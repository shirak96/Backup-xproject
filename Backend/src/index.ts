const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});


import SettingController from "./controllers/SettingController";
import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import * as express from "express";
import {NextFunction, Request, Response} from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import * as cron from 'node-cron';
import routes from "./routes";
import {ErrorHandler, handleError} from "./utils/errors";
import {YoutubeVideo} from "./entity/YoutubeVideo";
import {diff_minutes} from "./utils";
import YoutubeVideoController from "./controllers/YoutubeVideoController";


//require("dotenv").config();
// Create a new express application instance
const app = express();
app.use(express.static(__dirname + '/../public'));
//Connects to the Database -> then starts the express
createConnection()
    .then(async connection => {


        // Call middleware
        app.use(cors());
        app.use(helmet());
        app.use(
            express.json({
                // We need the raw body to verify webhook signatures.
                // Let's compute it only when hitting the Stripe webhook endpoint.
                verify: function (req: any, res, buf) {
                    if (req.originalUrl.startsWith('/webhook')) {
                        req.rawBody = buf.toString();
                    } else {
                        app.use(bodyParser.json());
                        app.use(bodyParser.urlencoded({extended: true}));
                    }
                },
                limit: "50mb",
            })
        );


        //Set all routes from routes folder
        app.use("/", routes);

        // Cron jon to run every day at 12:00 am
        cron.schedule("0 */12 * * *", async function () {
            await YoutubeVideoController.updateLatestYoutubeVideos();
        });

        // Cron jon to run every 15 minutes
        cron.schedule("*/15 * * * *", async function () {
            const youtube_live_check_last_api_call = await SettingController.getSetting('youtube_live_check_last_api_call');
            const differenceInMinutesMoreThan8Minutes = youtube_live_check_last_api_call === undefined ? true : diff_minutes(new Date(), new Date(youtube_live_check_last_api_call.value)) > 8;
            console.log(differenceInMinutesMoreThan8Minutes, 'differenceInMinutesMoreThan8Minutes');
            // if api was called in the last n minutes it mean that the high probability is that the last video still live
            if (differenceInMinutesMoreThan8Minutes) {
                await YoutubeVideoController.sendYoutubeLiveStreamInfo();
            }
        });

        const youtube_live_check_last_api_call = await SettingController.getSetting('youtube_live_check_last_api_call');
        const differenceInMinutesMoreThan8Minutes = youtube_live_check_last_api_call === undefined ? true : diff_minutes(new Date(), new Date(youtube_live_check_last_api_call.value)) > 4;
        console.log(differenceInMinutesMoreThan8Minutes, 'differenceInMinutesMoreThan8Minutes');
        console.log(differenceInMinutesMoreThan8Minutes, 'differenceInMinutesMoreThan8Minutes');
        // if api was called in the last n minutes it mean that the high probability is that the last video still live
        if (differenceInMinutesMoreThan8Minutes) {
            await SettingController.updateSetting('youtube_live_check_last_api_call', new Date().toString());
            await YoutubeVideoController.sendYoutubeLiveStreamInfo();
        }
        app.get('/reset/youtube/:pass', async (req: Request, res: Response, next: NextFunction) => {
            if (req.params.pass === 'batata') {
                const youtubeVideoRepository = getRepository(YoutubeVideo);

                await youtubeVideoRepository.delete({eventType: "none"});

                await YoutubeVideoController.sendYoutubeLiveStreamInfo();
                res.send('working');

            }
        });

        app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
            if (res.headersSent) {
                return next(err)
            }

            handleError(err, res);
        });

        app.use(function (error: ErrorHandler | Error, req: Request, res: Response, next: NextFunction) {
            if (res.headersSent) {
                return next(error)
            }
            if (error instanceof ErrorHandler) {
                return res.status(400).json({
                    type: "AssertionError",
                    message: error.message
                });
            }
            next(error);
        });

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server started on port ${process.env.PORT}!`);
        });
    })
    .catch(error => console.log("error end", error));
