import { Models } from "../Models/youtube-video-Model";

export const Controller = {
    getYoutubeVideoList: async function() {
        return await Models.getYoutubeVideoList();
    },
    getYoutubeLiveInfo: async function () {
        return await Models.getYoutubeLiveInfo();
    },
    reFetchLiveVideo: async function(){
        return await Models.reFetchLiveVideo();
    }
}



/**
 * =====================TESTING===========================
 * @funtion isError checks if api returns an error
 * got it from here: https://stackoverflow.com/questions/30469261/checking-for-typeof-error-in-js
 * @param {error}
 * @returns {bool}
 */
// eslint-disable-next-line no-unused-vars
function isError(e) {
    return e && e.stack && e.message && typeof e.stack === 'string'
        && typeof e.message === 'string';
}
