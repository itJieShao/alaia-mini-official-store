import apollo from '../apollo'

import {
  addresses,
  bindMobileForWechatGql,
  checkNote,
  clearUseLess,
  createFavorite,
  delFavorite,
  deliveryAddressCreate,
  deliveryAddressUpdate,
  fetchFavorites,
  fetchFavoritesDetail,
  getWechatMiniAppDecryptedPhone,
  getWechatMiniAppOpenId,
  isExistMobilePhone,
  loginByAuthCodeGql,
  removeAddress,
  sendNote,
  updatePasswordGql,
  updateUserInfo,
  userLogin,
  visitorLoginGql,
  decryptDataGql,
  deliveryAddressesGql,
  queryAccountInfoGql,
} from '../gqls'
import { CURRENT_API } from '../../constants/env'
import { AUTH_TOKEN } from '../../constants/user'

// 用户登陆
export const userLoginApi = (userLoginInput) => apollo.mutate({
  mutation: userLogin,
  variables: {
    userLoginInput,
  },
  fetchPolicy: 'no-cache',
}).catch((e) => {
  throw Error(e)
})

// 获取用户信息
export const userInfoApi = () => fetch(CURRENT_API, {
  body: {
    operationName: 'userInfo',
    variables: {},
    query: 'query userInfo { customer {   userInfo { data {   account   email   mobile   code   isVisitor   labels { code name __typename   }   __typename } extension {   mobile   birthday   firstName   lastName   gender   userRemark   __typename } userErrors {   code   message   __typename } __typename   }   __typename }}',
  },
  headers: {
    authorization: uni.getStorageSync(AUTH_TOKEN),
  },
  method: 'POST',
})
  .then((res) => {
    // console.log(uni.getStorageSync(AUTH_TOKEN))
    const data = res.text()
    return data.then((res) => JSON.parse(res))
  })
// 获取小程序的登陆信息
export const getWechatMiniAppOpenIdApi = (input) => apollo.query({
  query: getWechatMiniAppOpenId,
  variables: {
    input,
  },
}).catch((e) => {
  throw Error(e)
})

// 获取用户信息
export const getAccountInfoApi = () => apollo.query({
  query: queryAccountInfoGql,
}).catch((e) => {
  throw Error(e)
}) 

// 解密微信手机号码
export const getWechatMiniAppDecryptedPhoneApi = (input) => apollo.query({
  query: getWechatMiniAppDecryptedPhone,
  variables: {
    input,
  },
}).catch((e) => {
  throw Error(e)
})

export const updateUserInfoApi = (input) => apollo.mutate({
  mutation: updateUserInfo,
  variables: {
    input,
  },
})

export const sendNoteApi = (input) => apollo.mutate({
  mutation: sendNote,
  variables: {
    input,
  },
  fetchPolicy: 'no-cache',
}).catch((e) => {
  throw Error(e)
})

export const checkNoteApi = (input) => apollo.mutate({
  mutation: checkNote,
  variables: {
    input,
  },
  fetchPolicy: 'no-cache',
}).catch((e) => {
  throw Error(e)
})

export const addressesApi = () => apollo.query({
  query: addresses,
  fetchPolicy: 'no-cache',
}).catch((e) => {
  throw Error(e)
})

export const removeAddressApi = (addressCode) => apollo.mutate({
  mutation: removeAddress,
  variables: {
    addressCode,
  },
  fetchPolicy: 'no-cache',
}).catch((e) => {
  throw Error(e)
})

export const createFavoriteApi = (input) => apollo.mutate({
  mutation: createFavorite,
  variables: {
    input,
  },
}).catch((e) => {
  throw Error(e)
})

export const fetchFavoritesApi = ({ size, page }) => apollo.query({
  query: fetchFavorites,
  fetchPolicy: 'network-only',
  variables: {
    page,
    size,
  },
}).catch((e) => {
})

export const delFavoriteApi = (input) => apollo.mutate({
  mutation: delFavorite,
  variables: {
    input,
  },
}).catch((e) => {
  throw Error(e)
})

export const fetchFavoritesDetailApi = ({ size, page }) => apollo.query({
  query: fetchFavoritesDetail,
  fetchPolicy: 'network-only',
  variables: {
    page,
    size,
  },
}).catch((e) => {
  throw Error(e)
})

export const clearUseLessApi = () => apollo.mutate({
  mutation: clearUseLess,
  fetchPolicy: 'no-cache',
}).catch((e) => {
  throw Error(e)
})

export const updateUserPasswordApi = (input) => apollo.mutate({
  mutation: updatePasswordGql,
  fetchPolicy: 'no-cache',
  variables: {
    input,
  },
})

// 查询收货地址列表
export const deliveryAddressesApi = ({ size, page }) => apollo.query({
  query: deliveryAddressesGql,
  fetchPolicy: 'network-only',
  variables: {
    page,
    size,
  },
}).catch((e) => {
})

export const deliveryAddressCreateApi = (input) => apollo.mutate({
  mutation: deliveryAddressCreate,
  fetchPolicy: 'no-cache',
  variables: {
    input,
  },
}).catch((e) => {
  throw Error(e)
})

export const deliveryAddressUpdateApi = (input) => apollo.mutate({
  mutation: deliveryAddressUpdate,
  fetchPolicy: 'no-cache',
  variables: {
    input,
  },
}).catch((e) => {
  throw Error(e)
})

export const isExistMobilePhoneApi = (mobilePhone) => apollo.mutate({
  mutation: isExistMobilePhone,
  fetchPolicy: 'no-cache',
  variables: {
    mobilePhone,
  },
}).catch((e) => {
  throw Error(e)
})

export const createContactUsApi = (input) => apollo.mutate({
  mutation: createContactUs,
  variables: {
    input,
  },
})

export const bindMobileForWechatApi = (input) => apollo.mutate({
  mutation: bindMobileForWechatGql,
  variables: {
    input,
  },
})

export const loginByAuthCodeApi = (code) => apollo.mutate({
  mutation: loginByAuthCodeGql,
  variables: {
    input: code,
  },
})

export const visitorLoginApi = () => apollo.mutate({
  mutation: visitorLoginGql,
})

export const decryptData = (input) => apollo.mutate({
  mutation: decryptDataGql,
  variables: input,
})

