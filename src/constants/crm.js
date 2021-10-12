// 第三方小程序的appid
export const CRM_APP_ID = 'wx267e7453e7a8d342'

export const PARAM_OBJ = {
  fromChannel: 'store0091',
  activityId: 'AOPforwechatEC',
  fromId: '',
}

// 第三方跳转的路径  formId 表示 unionId
// activityId 表示来源（是从别人分享进来的呢，还是直接搜一搜进入小程序的呢），默认“AOPforwechatEC”
export const getCRMURI = (unionId, activityId) => {
  const source = activityId ? `AOPforwechatECfrom${activityId}` : 'AOPforwechatEC'
  const url = `pages/experience/index/index?fromChannel=store0091&activityId=${source}&fromId=${unionId}`
  return url
}
