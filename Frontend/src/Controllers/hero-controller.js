import { Models } from '../Models/hero-model'

export const Controller = {
  getHeroList: async function (lang = 'fr') {
    return await Models.getHeroList(lang)
  }
}
