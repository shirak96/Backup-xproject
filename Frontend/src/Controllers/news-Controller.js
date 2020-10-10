import { Models } from '../Models/news-Model'

export const Controller = {
  getNewsList: async function (lang = 'fr') {
    return await Models.getNewsList(lang)
  },
}
