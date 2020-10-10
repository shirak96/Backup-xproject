import { CallAPI } from './Main.js'

export const Models = {
  getSettingByKey: async function (key) {
    return await CallAPI(`setting/search?key=${key}`)
  }
};
