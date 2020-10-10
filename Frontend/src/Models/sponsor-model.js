import { CallAPI } from './Main.js'

export const Models = {
  getSponsorList: async function (lang = 'fr') {
    return await CallAPI(`sponsor?lang=${lang}`)
  }
};
