import SettingController from "./SettingController";
import config from "../config/config";

import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {jsonResponse} from "../utils/response";
import {YoutubeVideo} from "../entity/YoutubeVideo";
//api service
import {
    getCompletedYoutubeLiveVideo,
    getLatestYoutubeVideosFromAPI,
    getYoutubeLiveStreamInfo
} from "../services/youtube";
import {diff_minutes} from "../utils";
import {sendMessageToSlack} from "../services/slack";

require("dotenv").config();

class YoutubeVideoController {


    static createYoutubeVideo = async ({videoId, title, publishedAt, eventType = "live", description = "", thumbnail = ""}) => {
        const youtubeVideoRepository = getRepository(YoutubeVideo);
        const youtubeVideo = new YoutubeVideo();
        youtubeVideo.videoId = videoId;
        youtubeVideo.title = title;
        youtubeVideo.eventType = eventType;
        youtubeVideo.description = description;
        youtubeVideo.thumbnail = thumbnail;
        youtubeVideo.publishedAt = publishedAt;

        const errors = await validate(youtubeVideo);
        if (errors.length === 0) {

            await youtubeVideoRepository.save(youtubeVideo);
        }
        return await youtubeVideoRepository.find({where: {eventType: 'live'}});
    }


    static getLatestYoutubeVideos = async () => {

        const videos = await getLatestYoutubeVideosFromAPI(config.YOUTUBE_API_KEY, config.YOUTUBE_CHANNEL_ID);

        if (videos.length === 0) {
            const youtubeVideoRepository = getRepository(YoutubeVideo);
            return await youtubeVideoRepository.find();
        } else {
            return videos;
        }

    };

    static updateLatestYoutubeVideos = async () => {

        try {
            const videos = await YoutubeVideoController.getLatestYoutubeVideos();
            const youtubeVideoRepository = getRepository(YoutubeVideo);
            // Delete old videos
            await youtubeVideoRepository.delete({
                eventType: 'latest'
            });

            videos.map(async ({videoId, title, description, publishedAt, thumbnail}, index) => {

                const youtubeVideo = new YoutubeVideo();

                youtubeVideo.videoId = videoId;
                youtubeVideo.title = title;
                youtubeVideo.description = description;
                youtubeVideo.eventType = 'latest';
                youtubeVideo.publishedAt = publishedAt;
                youtubeVideo.thumbnail = thumbnail;

                const errors = await validate(youtubeVideo);
                if (errors.length > 0) {
                } else {

                    const youtubeVideoRepository = getRepository(YoutubeVideo);
                    await youtubeVideoRepository.save(youtubeVideo);
                    await sendMessageToSlack({
                        webhookURL: config.SLACK_WEBHOOK_URL,
                        message: 'Youtube video latest run successfully -_- index: ' + index
                    })

                }
            })
        } catch (e) {
            await sendMessageToSlack({webhookURL: config.SLACK_WEBHOOK_URL, message: 'Youtube video latest failed _-_'})
        }

    }

    static sendYoutubeLiveStreamInfo = async () => {
        try {
            const youtubeVideoRepository = getRepository(YoutubeVideo);
            const videos = await getYoutubeLiveStreamInfo(config.YOUTUBE_API_KEY, config.YOUTUBE_CHANNEL_ID);

            if (videos.length > 0) {

                const {videoId, title, eventType, publishedAt} = videos[0];
                const youtubeVideo = new YoutubeVideo();

                youtubeVideo.videoId = videoId;
                youtubeVideo.title = title;
                youtubeVideo.eventType = eventType;
                youtubeVideo.description = '';
                youtubeVideo.thumbnail = '';
                youtubeVideo.publishedAt = publishedAt;

                const errors = await validate(youtubeVideo);
                if (errors.length > 0) {
                    console.log('errors', errors);
                } else {
                    // Delete old videos after checking that the new video can be added without errors
                    await youtubeVideoRepository.delete({
                        eventType: 'live'
                    });
                    await youtubeVideoRepository.save(youtubeVideo);
                }

            } else {
                const completedLiveVideos: Array<any> = await getCompletedYoutubeLiveVideo(config.YOUTUBE_API_KEY, config.YOUTUBE_CHANNEL_ID);

                console.log('completedLiveVideos', completedLiveVideos)
                if (completedLiveVideos.length > 0) {
                    ['completed'].map(async criteria => {
                        await youtubeVideoRepository.delete({eventType: criteria});

                    })

                    const youtubeVideo = new YoutubeVideo();
                    const {videoId, title, publishedAt} = completedLiveVideos[0];
                    youtubeVideo.videoId = videoId;
                    youtubeVideo.title = title;
                    youtubeVideo.eventType = 'completed';
                    youtubeVideo.description = '';
                    youtubeVideo.thumbnail = '';
                    youtubeVideo.publishedAt = publishedAt;

                    const errors = await validate(youtubeVideo);
                    console.log('errors ===>', errors)
                    if (errors.length === 0) {
                        await youtubeVideoRepository.save(youtubeVideo);
                        await sendMessageToSlack({
                            webhookURL: config.SLACK_WEBHOOK_URL,
                            message: 'Youtube video live ran successfully _-_'
                        })
                    }else {
                        throw new Error('Video not saved to the database')
                    }

                }
            }
        } catch (e) {
            await sendMessageToSlack({webhookURL: config.SLACK_WEBHOOK_URL, message: 'Youtube video live failed _-_'})
        }
    }


    static listAllYoutubeVideos = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const youtubeVideoRepository = getRepository(YoutubeVideo);
            //Get youtube videos from database
            const youtubeVideos = await youtubeVideoRepository.find({where: {eventType: 'latest'}});

            // Send the youtube videos object
            res.status(200).json(jsonResponse(youtubeVideos));
        } catch (err) {
            err.status = 500;
            err.statusCode = 500;
            next(err);
        }
    };

    static listLiveYoutubeVideos = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const youtubeVideoRepository = getRepository(YoutubeVideo);
            let youtubeVideos = await youtubeVideoRepository.find({where: {eventType: 'live'}});
            if (youtubeVideos.length === 0) {
                youtubeVideos = await youtubeVideoRepository.find({where: {eventType: 'completed'}});
            }
            res.status(200).json(jsonResponse(youtubeVideos));
        } catch (err) {
            err.status = 500;
            err.statusCode = 500;
            next(err);
        }
    }

    static CheckForExistingYoutubeLive = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const youtube_live_check_last_api_call = await SettingController.getSetting('youtube_live_check_last_api_call');
            console.log('youtube_live_check_last_api_call ===>', youtube_live_check_last_api_call);
            const differenceInMinutesMoreThan8Minutes = youtube_live_check_last_api_call === undefined ? true : diff_minutes(new Date(), new Date(youtube_live_check_last_api_call.value)) > 8;
            console.log('differenceInMinutesMoreThan8Minutes', differenceInMinutesMoreThan8Minutes)
            // if api was called in the last n minutes it mean that the high probability is that the last video still live
            if (differenceInMinutesMoreThan8Minutes) {
                const youtubeVideoRepository = getRepository(YoutubeVideo);

                const fetchLiveVideos: Array<any> = await getYoutubeLiveStreamInfo(config.YOUTUBE_API_KEY, config.YOUTUBE_CHANNEL_ID);
                await SettingController.updateSetting('youtube_live_check_last_api_call', new Date().toString());

                console.log('fetchLiveVideos', fetchLiveVideos);
                // do we have an active live video ? yes : no
                if (fetchLiveVideos.length > 0) {

                    await youtubeVideoRepository.delete({eventType: "live"});

                    const {videoId, title, publishedAt} = fetchLiveVideos[0];
                    const videos = await YoutubeVideoController.createYoutubeVideo({
                        videoId,
                        title,
                        publishedAt,
                        eventType: 'live',
                        thumbnail: '',
                        description: ''
                    })
                    res.status(200).json(jsonResponse(videos));


                } else {
                    const completedLiveVideos: Array<any> = await getCompletedYoutubeLiveVideo(config.YOUTUBE_API_KEY, config.YOUTUBE_CHANNEL_ID);

                    console.log('completedLiveVideos', completedLiveVideos)
                    if (completedLiveVideos.length > 0) {
                        await youtubeVideoRepository.delete({eventType: "completed"});

                        const {videoId, title, publishedAt} = completedLiveVideos[0];
                        const videos = await YoutubeVideoController.createYoutubeVideo({
                            videoId,
                            title,
                            publishedAt,
                            eventType: 'completed',
                            description: '',
                            thumbnail: '',
                        })

                        res.status(200).json(jsonResponse(videos));

                    } else {
                        // pass it to get all live videos to be specified in the routes
                        next();
                    }


                }
            } else {
                // pass it to get all live videos to be specified in the routes
                next()

            }

        } catch (err) {
            err.status = 500;
            err.statusCode = 500;
            next(err);
        }
    }


}

export default YoutubeVideoController;
