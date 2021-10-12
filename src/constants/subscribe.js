// 到货通知
export const ARRIVAL_NOTICE_ID = '9LJCHs4XoxrWg5OvaoGzW90v7Y9K91HOwRtaKVT_CwA'

// 订单发货通知
export const DELIVER_GOODS = 'ZlwI5oD-VRGvj5wzN0YRrctPRauF4KAOxKPinF0j_l4'

// 支付成功通知
export const PAY_SUCCESS = 'r75S3nQl5QYogkv5cSvXbxJbHI0qTMPNvPmxtyv9it8'

// 待付款提醒
export const WAIT_PAY = 'evbmxlVE4eVQVyzdBjEMMkL8gWuMKO_G_7pTU733cF8'

export const TYPE_CODE = {
  ARRIVAL_NOTICE: 'ARRIVAL_NOTICE',
  ORDER: 'ORDER',
}

export const IDS = {
  // 到货提醒
  [TYPE_CODE.ARRIVAL_NOTICE]: [ARRIVAL_NOTICE_ID],
  // 订单订阅
  [TYPE_CODE.ORDER]: [DELIVER_GOODS, PAY_SUCCESS, WAIT_PAY],
}

export const REMIND_WAY = {
  // 到货提醒
  [TYPE_CODE.ARRIVAL_NOTICE]: {
    [ARRIVAL_NOTICE_ID]: ['WX_SUBSCRIBE_ITEM_ARRIVAL'],
  },
  // 订单订阅
  // ['WX_ORDER_DELIVER', 'SMS_ORDER_DELIVER', 'SMS_ORDER_PAY_REMIND', 'WX_ORDER_PAY_SUCCESS', 'WX_ORDER_PAY_REMIND', 'SMS_ORDER_PAY_SUCCESS']
  [TYPE_CODE.ORDER]: {
    [DELIVER_GOODS]: ['WX_ORDER_DELIVER', 'SMS_ORDER_DELIVER'],
    [PAY_SUCCESS]: ['WX_ORDER_PAY_SUCCESS', 'SMS_ORDER_PAY_SUCCESS'],
    [WAIT_PAY]: ['SMS_ORDER_PAY_REMIND', 'WX_ORDER_PAY_REMIND'],
  },
}

export const MSG = {
  SUCCESS: '订阅成功',
  REFUSE: '订阅失败',
  NO_AUTH: '您关闭了小程序订阅消息开关, \r\n 请在小程序设置中打开',
  NEED_UPDATE: '您的微信版本过低，请更新到最新版本',
  SUBSCRIBED: '您已订阅',
}
