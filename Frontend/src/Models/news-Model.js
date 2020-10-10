import { CallAPI } from './Main.js'

export const Models = {
  getNewsList: async function (lang) {
    return await CallAPI(`news?lang=${lang}`)
  }
};
