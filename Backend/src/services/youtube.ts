import * as request from 'request';
import {Response} from 'request';
import {isNull} from "util";

export const getLatestYoutubeVideosFromAPI = async (api_key: string, channel_id: string) => {
    return new Promise<[]>(async (resolve, reject) => {
        request(`https://www.googleapis.com/youtube/v3/search?key=${api_key}&channelId=${channel_id}&part=snippet,id&order=date&maxResults=1&type=video`,
            async function (error: any, response: Response, body: any) {
                if (isNull(error)) {
                    let json = JSON.parse(body);
                    const {items = [], code} = json;
                    if (code === 400) {
                        reject("API ERROR");
                    } else {
                        const videos = items.map((item: any) => {
                            const {id, snippet} = item;
                            const {videoId} = id;
                            const {title, description, publishedAt, thumbnails} = snippet;
                            return {
                                videoId,
                                title,
                                description,
                                publishedAt,
                                thumbnail: thumbnails.medium.url
                            }
                        });
                        resolve(videos);
                    }
                } else {
                    resolve([]);
                }
            });
    })
};

export const getYoutubeLiveStreamInfo = (apiKey: string, channelId: string) => {
    return new Promise<Array<any>>(async (resolve, reject) => {
        // console.log('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UC8tXAK418yfYGPbSLw4Y9Hg&eventType=live&maxResults=25&type=video&key=AIzaSyC6GSujaBf5d3-2jLNoy0U4c4RithHqmzk')
        request(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&maxResults=1&type=video&key=${apiKey}`,
            async function (err: any, res: any, body: any) {
                if (isNull(err)) {
                    let json = JSON.parse(body);

                    let {items = [], code} = json;
                    if (code === 400) {
                        reject('API ERROR');
                    } else {
                        const LiveVideoInfo = items.map((item: any) => {
                            const {id, snippet} = item;
                            const {videoId} = id;
                            const {publishedAt, channelTitle, liveBroadcastContent} = snippet;
                            return {
                                videoId,
                                title: channelTitle,
                                eventType: liveBroadcastContent,
                                publishedAt
                            }
                        });
                        resolve(LiveVideoInfo);

                    }
                }
            }
        );
    })
};

export const getCompletedYoutubeLiveVideo = (apiKey: string, channelId: string) => {
    return new Promise<[]>(async (resolve, reject) => {
        console.log(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=completed&maxResults=1&type=video&key=${apiKey}`)
        request(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=completed&maxResults=1&type=video&key=${apiKey}`,
            async function (err: any, res: any, body: any) {
                if (isNull(err)) {
                    let json = JSON.parse(body);

                    const { items = [], code } = json;
                    if (code === 400) {
                        reject("API ERROR");
                    } else {
                        const LiveVideoInfo = items.map((item: any) => {
                            const { id, snippet } = item;
                            const { videoId } = id;
                            const { publishedAt, channelTitle, liveBroadcastContent } = snippet;
                            return {
                                videoId,
                                title: channelTitle,
                                eventType: liveBroadcastContent,
                                publishedAt
                            }
                        });
                        resolve(LiveVideoInfo);
                    }
                }
            }
        );
    })
};
