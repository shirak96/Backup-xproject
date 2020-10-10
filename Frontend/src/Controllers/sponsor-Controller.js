import { Models } from '../Models/sponsor-model'

export const Controller = {
  getSponsorList: async function (lang = 'fr') {
    return await Models.getSponsorList(lang)
  }
}
