import { Models } from '../Models/settings-Model'

export const Controller = {
  getSettingByKey: async function (key) {
    return await Models.getSettingByKey(key)
  },
}
