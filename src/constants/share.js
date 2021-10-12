export const SHARE_SIGN = 'sharing'
export const QY_SHARE_SIGN = 'hd'
export const SHARE_OBJ = {
  utm_medium: SHARE_SIGN,
  utm_source: 'wechat',
  utm_campaign: '',
}

// 企业分享
export const QY_SHARE_OBJ = {
  utm_medium: QY_SHARE_SIGN,
  utm_source: 'qwechat',
}

export const SHARE_PARAMS = (function () {
  const str = []
  const OBJ = wx.qy ? { ...SHARE_OBJ, ...QY_SHARE_OBJ } : { ...SHARE_OBJ }
  for (const i in OBJ) {
    str.push(`${i}=${OBJ[i]}`)
  }
  return str.join('&')
}());

export const SPLIT_SIGN = ':'
export const ENCODE_SPLIT_SIGN = encodeURIComponent(SPLIT_SIGN)
export const QR_CODE_SIGN = `${ENCODE_SPLIT_SIGN}${SHARE_SIGN}`

export const PAGE_TYPE = {
  PDP: 'pdp',
  PLP: 'plp',
  INDEX: 'index',
  ACTIVITY: 'plpactivity',
}

export const SHARE_URL_LIST = ['subPackages/pdp/pages/pdp/index', 'pages/index/index']

export const SHARE_PAGE = {
  [PAGE_TYPE.PDP]: SHARE_URL_LIST[0],
  [PAGE_TYPE.INDEX]: SHARE_URL_LIST[1],
}
