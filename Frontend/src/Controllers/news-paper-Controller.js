import { Models } from "../Models/news-paper-Model";

export const Controller = {
    getNewsPaperList: async function() {
        return await Models.getNewsPaperList();
    }
}
