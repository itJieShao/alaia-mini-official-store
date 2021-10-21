import {
  syncCrmMemberInfo, decryptData, queryCustomer, bindMobileByVerifyCode, bindMobileByEncryptedData,
  updateAccountInfo, editAccountInfo,
} from '../service/apis/account'
import { shopApi } from '../service/apis/shop'
import { get } from '../utils/utilityOperationHelper'
import {
  visitorLoginApi, loginByAuthCodeApi,
  deliveryAddressCreateApi, deliveryAddressUpdateApi,
  deliveryAddressesApi, removeAddressApi, getAccountInfoApi,
} from '../service/apis/user'

import {
  IS_MEMBER_LOGIN, USER_INFO, ANONYMOUS_AUTH_TOKEN, UNION_ID,
  AUTH_TOKEN,
  OPEN_ID,
  MOBILE
} from '../constants/user'

import { trackerClick, EVENT_TYPE } from '../utils/ga'
import userAction from './userAction'

const state = {
  unionId: null,
  isNeedToThirdProgram: false,
  userInfo: {},
  openId: null,
  mobile: null,
};
const getters = {
  isLogin: () => uni.getStorageSync(IS_MEMBER_LOGIN),
  userInfo: (state) => (Object.keys(state.userInfo) === 0 ? uni.getStorageSync(USER_INFO) || {} : state.userInfo),
  unionId: (state) => state.unionId || uni.getStorageSync(UNION_ID),
  isNeedToThirdProgram: (state) => state.isNeedToThirdProgram,
  openId: (state) => state.openId || uni.getStorageSync(OPEN_ID),
  mobile: (state) => state.mobile || uni.getStorageSync(MOBILE),
}

let loginInstance;

const actions = {
  syncCrmMemberInfo(_) {
    return syncCrmMemberInfo().then()
  },
  visitorLogin({ getters }) {
    if (getters.isLogin) {
      return Promise.resolve()
    }
    return visitorLoginApi().then((res) => {
      const token = get(res, 'data.visitorLogin.token')
      uni.setStorageSync(ANONYMOUS_AUTH_TOKEN, token)
      return token
    })
  },
  decryptData({ commit }, params) {
    return decryptData(params).then((res) => {
      const userInfo = JSON.parse(get(res, 'data.decryptData') || '{}')
      commit('setUnionId', userInfo.unionId)
      return userInfo
    })
  },
  // 绑定手机号,根据微信加密数据
  bindMobileByEncryptedData({ commit }, params) {
    return bindMobileByEncryptedData(params).then((res) => {
      const userInfo = JSON.parse(get(res, 'data.bindMobileByEncryptedData') || '{}')
      commit('setUnionId', userInfo.unionId)
      return userInfo
    })
  },
  setIsNeedToThirdProgram({ commit }, value) {
    commit('setIsNeedToThirdProgram', value)
  },
  getUserInfo({ commit }) {
    return queryCustomer().then((res) => {
      const customer = get(res, 'data.customer');
      customer.accountInfo = customer.accountInfo || {};
      customer.crmMemberInfo = customer.crmMemberInfo || {};

      commit('setUserInfo', customer)
      return customer
    })
  },
  loginByAuthCode({ commit }, showLoading = true) {
    // showLoading && uni.showLoading({ mask: true, title: '加载中...' });
    if (loginInstance) return loginInstance
    // 多次调用此接口，都返回同一个实例，防止重复发起请求
    loginInstance = new Promise((resolve, reject) => {
      uni.login().then((res) => {
        const code = get(res, '1.code');
        uni.setStorageSync(IS_MEMBER_LOGIN, false);
        return loginByAuthCodeApi(code);
      }).then((res) => {
        const userErrors = get(res, 'data.miniProgramLogin.userErrors');
        if (!userErrors) {
          return Promise.reject(Error(get(userErrors, '0.message')));
        }
        const customer = get(res, 'data.miniProgramLogin.customer');
        // const weixinInfo = uni.getStorageSync('weixinInfo')
        console.log('customer',customer)
        // console.log('weixinInfo',uni.getStorageSync('weixinInfo'))
        const token = get(res, 'data.miniProgramLogin.token');
        customer.accountInfo = customer.accountInfo || {};
        customer.crmMemberInfo = customer.crmMemberInfo || {};
        uni.setStorageSync(AUTH_TOKEN, token);
        commit('setUserInfo', customer)
        commit('setOpenId', get(customer, 'openId'))
        commit('setUnionId', get(customer, 'unionId'))
        if (!customer.mobile) {
          uni.setStorageSync(IS_MEMBER_LOGIN, false);
        } else {
          uni.setStorageSync(IS_MEMBER_LOGIN, true);
        }
        resolve(customer);
      }).catch((err) => reject(Error(err)))
        .finally(() => {
          uni.hideLoading()
          loginInstance = null
        });
    });

    return loginInstance
  },
  bindMobileByVerifyCode(_, params) {
    return bindMobileByVerifyCode(params).then((res) => res)
  },
  updateAccountInfo(_, params) {
    return updateAccountInfo(params).then((res) => {
      const data = get(res, 'data.lpAccountUpdate') || []
      // 如果在CRM注册成功之后，需要发送GA埋点信息
      if (data.find((item) => item === 'CRM_REGISTER_SUCCESS')) {
        // 做GA的处理
        trackerClick({ ...EVENT_TYPE.REGISTER_USER_EVENT, screenName: '用户注册' })
      }
      return res
    })
  },
  editAccountInfo(_, params) {
    return editAccountInfo(params).then((res) => res)
  },
  deliveryAddressCreateApi(_, params) {
    return deliveryAddressCreateApi(params).then((res) => res)
  },
  deliveryAddressUpdateApi(_, params) {
    return deliveryAddressUpdateApi(params).then((res) => res)
  },
  deliveryAddressesApi(_, params) {
    return deliveryAddressesApi(params).then((res) => res)
  },
  removeAddressApi(_, params) {
    return removeAddressApi(params).then((res) => res)
  },
  shopApi(_, params) {
    return shopApi(params).then((res) => res)
  },
  // 获取用户信息
  getAccountInfoApi(_, params) {
    return getAccountInfoApi(params).then((res) => res)
  },
}
const mutations = {
  setUnionId(state, value) {
    uni.setStorageSync(UNION_ID, value)
    state.unionId = value
  },
  setIsNeedToThirdProgram(state, value) {
    state.isNeedToThirdProgram = value
  },
  setUserInfo(state, value) {
    uni.setStorageSync(USER_INFO, value);
    state.userInfo = value || {}
  },
  setOpenId(state, value) {
    uni.setStorageSync(OPEN_ID, value)
    state.openId = value
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
