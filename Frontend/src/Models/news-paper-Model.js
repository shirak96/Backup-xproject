import { CallAPI } from "./Main.js"


export const Models = {
    getNewsPaperList: async function () {
        return await CallAPI("newspaper")
    }
};
