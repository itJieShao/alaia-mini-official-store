import {
  SPLIT_SIGN, ENCODE_SPLIT_SIGN, SHARE_PAGE, PAGE_TYPE,
} from '../constants/share'
import { BA_ID, STORE_CODE } from '../constants/qy'

export const getBaInfoByShare = (params) => {
  if (wx.qy) return {}
  const { query, path } = params
  // 如果是通过太阳码进来的
  // 太阳码分享的
  let sceneList = []
  if (path === SHARE_PAGE[PAGE_TYPE.PDP] && query.scene) {
    sceneList = query.scene.indexOf(SPLIT_SIGN) >= 0 ? query.scene.split(SPLIT_SIGN) : query.scene.split(ENCODE_SPLIT_SIGN)
  }
  return {
    baId: query[BA_ID] || sceneList[2],
    storeCode: query[STORE_CODE] || sceneList[3],
  }
  return {}
}
