import { USER_INFO } from '../constants/qy'
import { qyUserInfo } from '../service/apis/qy'
import { get } from '../utils/utilityOperationHelper'

const state = {
  environment: '',
  // 企业微信中，用户自己的id
  userInfo: null,
  // 客户打开小程序时，获取的BA的id
  baID: '',
  // 客户打开小程序时，获取的BA的门店信息
  storeCode: '',
}

const getters = {
  environment(state) { return state.environment },
  isQY() {
    return wx.qy
  },
  qyUserInfo: (state) => guideInfo(state),
  baID: (state) => state.baID,
  storeCode: (state) => state.storeCode,
  // 导购信息
  guideInfo: (state) => (wx.qy ? guideInfo(state) : { userId: state.baID, storeCode: state.storeCode }),
}
function guideInfo(state) {
  return state.userInfo || uni.getStorageSync(USER_INFO) || {}
}

const actions = {
  setEnvironment({ commit }, value) {
    commit('setEnvironment', value)
  },
  // 企业登陆获取信息
  qyLogin({ dispatch }) {
    return new Promise(() => {
      if (wx.qy) {
        wx.qy.login({
          success: (res) => {
            dispatch('getQyUserInfo', get(res, 'code')).then()
          },
        })
      }
    })
  },
  setBAInfo({ commit }, value) {
    commit('setBAInfo', value)
  },
  getQyUserInfo({ commit }, code) {
    return qyUserInfo(code).then((res) => {
      const errors = get(res, 'errors')
      if (errors && errors.length > 0) {
        uni.showToast({
          title: '获取BA信息失败，请重试',
          icon: 'none',
          mask: false,
        });
      } else {
        const userId = get(res, 'data.staffInfo.staffCode')
        const storeCode = get(res, 'data.staffInfo.storeCode')
        commit('setUserInfo', {
          userId,
          storeCode,
        })
      }
    })
  },

}

const mutations = {
  setEnvironment(state, value) {
    state.environment = value || ''
  },
  setUserInfo(state, value) {
    if (value && value.userId && value.storeCode) {
      state.userInfo = value
      uni.setStorageSync(USER_INFO, value);
    }
  },
  setBAInfo(state, value) {
    if (value && value.baId && value.storeCode) {
      state.baID = value.baId
      state.storeCode = value.storeCode
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
