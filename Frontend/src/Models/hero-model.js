import { CallAPI } from './Main.js'

export const Models = {
  getHeroList: async function (lang = 'fr') {
    return await CallAPI(`hero?lang=${lang}`)
  }
};
