import { SHARE_PAGE, SHARE_PARAMS } from '../constants/share'
import { BA_ID, STORE_CODE, ANALYTICS_TYPE } from '../constants/qy'

const QY_SHARE_SIGN = 'utm=hd'

/**
  homedelivery 分享规则：
    企业微信当中：BA可以分享给微信小程序的客户，客户可以接收到BA的编码，购买商品时，给BA算提成
    微信小程序当中：当客户A点开了BA分享的小程序，然后再将这个小程序分享给她的朋友B，那么BA的信息也会带给B
 */
export const getShareURL = ({ type, params, guideParams }) => {
  let url = SHARE_PAGE[type]
  if (params) {
    url += `?${params}&${SHARE_PARAMS}${type}`
  } else {
    url += `?${SHARE_PARAMS}${type}`
  }

  const guideInfoStr = getGuideInfo(guideParams)
  if (guideInfoStr) {
    url += `&${guideInfoStr}`
  }
  if (wx.qy) {
    url += `&${QY_SHARE_SIGN}`
  }
  reportWXAnalytics({ userInfo: guideParams, url })
  console.log(url, '-------分享的url')
  return url
}

/**
  非业务页面分享：
    常规互动、520活动页面
 */
export const getShareActivityURL = ({ url, guideParams }) => {
  let shareUrl = url
  const guideInfoStr = getGuideInfo(guideParams)
  if (guideInfoStr) {
    shareUrl = url.indexOf('?') >= 0 ? `${url}&${guideInfoStr}` : `${url}?${guideInfoStr}`
  }
  if (wx.qy) {
    shareUrl = url.indexOf('?') >= 0 ? `${shareUrl}&${QY_SHARE_SIGN}` : `${shareUrl}?${QY_SHARE_SIGN}`
  }
  reportWXAnalytics({ userInfo: guideParams, url: shareUrl })
  console.log(shareUrl, '-------分享的url')
  return shareUrl
}

function getGuideInfo(guideParams) {
  if (guideParams && guideParams.userId && guideParams.storeCode) {
    return `${BA_ID}=${guideParams.userId}&${STORE_CODE}=${guideParams.storeCode}`
  }
  return ''
}
// 信息上报, 小程序记录
export const reportWXAnalytics = ({ userInfo, url, spuCode }) => {
  if (!wx.qy || !userInfo || !userInfo.userId || !userInfo.storeCode) return
  let params = {
    ba_id: userInfo.userId,
    store_code: userInfo.storeCode,
  }
  if (url) {
    params = { ...params, page: url }
  }
  if (spuCode) {
    params = { ...params, spu_code: spuCode }
  }

  if (wx.qy) {
    params = { ...params, utm: 'hd' }
  }
  wx.reportAnalytics(ANALYTICS_TYPE.BA_SHARE, params);
}
