export const AUTH_TOKEN = 'apolloToken';
export const ANONYMOUS_AUTH_TOKEN = 'anonymousApolloToken';
export const USER_INFO = 'userInfo'
export const IS_MEMBER_LOGIN = 'isMemberLogin'

export const LOGIN_EXPIRE_ERROR_CODE = '10110143' // token过期
export const TOKEN_INVALID_ERROR_CODE = '00510104' // token失效code
export const TOKEN_IS_EMPTY_CODE = '00510103' // 访问凭证

export const WX_EXPIRE_CODE = '00510160001'

export const INVALID_TOKEN_CODE_ARRAY = [LOGIN_EXPIRE_ERROR_CODE, TOKEN_INVALID_ERROR_CODE, TOKEN_IS_EMPTY_CODE, '401', WX_EXPIRE_CODE]

export const OPEN_ID = 'openId'

export const PHONE_NUMBER = '4006161698'

export const HEADER_TIPS = 'show_header_tips'

export const languageList = [
  '中文',
  '英文',
  '日语',
  '其他',
];

export const countryList = [
  '中国',
  '韩国',
  '德国',
  '英国',
  '日本',
  '其他',
];

// 存储形式 {orderLines: [{spuCode: '', skuCode: '', quantity: 1}], guideInput: {guideId: '2323', o2oShopCode: 10010}}
export const ORDER_INFO = 'order_info'

// 存储微信的授权信息
export const WX_INFO = 'weixinInfo'

// 用户订阅信息
export const PROTOCOL = 'productProtocol'

export const USER_WX_INFO = 'userWXInfo'

export const AGREE = 'agree'

export const DISAGREE = 'disagree'

export const UNION_ID = 'unionId'
// 手机号
export const  MOBILE = 'mobile'

// 联系电话
export const SERVICE_TEL = '400-853-1616'
