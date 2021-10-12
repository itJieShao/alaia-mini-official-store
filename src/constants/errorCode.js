import { SERVICE_TEL } from './user'
/**
 * 后台code对应错误信息
 * */
const MODULE_CODE = '0051';
const MEMBER_MODULE_CODE = '01';

const EXIST_PHONE_MSG = `该手机号已被占用，请更换或联系客服${SERVICE_TEL}`

export default {
  MODULE_CODE,
  [`${MODULE_CODE + MEMBER_MODULE_CODE}50009`]: {
    message: EXIST_PHONE_MSG,
  },
}

// 手机号已存在
export const PHONE_EXIST_CODE = '00510150009'

export const SALE_OUT_PDP = '对不起，您选择的商品已无库存。'

export const SHELVES = '商品已下架'
export const LOACK_OF_INVENTORY = 'UEC11003'

export const getErrorMessage = (code, message) => {
  const errors = {
    [LOACK_OF_INVENTORY]: SALE_OUT_PDP,
    UEC11004: SHELVES,
    UEC10120106: '商品库存不足',
    UEC10001: SHELVES,
    [PHONE_EXIST_CODE]: EXIST_PHONE_MSG,
  }
  return errors[code] ? errors[code] : message
}
