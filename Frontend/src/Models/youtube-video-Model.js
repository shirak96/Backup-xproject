import { CallAPI } from "./Main.js"


export const Models = {
    getYoutubeVideoList: async function () {
        return await CallAPI("youtube-videos/latest")
    },
    getYoutubeLiveInfo: async function () {
        return await CallAPI("youtube-videos/live")
    },
    reFetchLiveVideo: async function (){
        return await CallAPI("youtube-videos/re-fetch-live");
    }
};
