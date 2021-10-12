import {
  subscribe,
  menusList,
  getAccessToken,
} from '../service/apis/common'
import {
  get,
} from '../utils/utilityOperationHelper'
import {
  IDS,
  REMIND_WAY,
  MSG,
  TYPE_CODE,
} from '../constants/subscribe'
import {
  CURRENT_HOST,
} from '../constants/env'

const state = {
  menusList: [],
  appletChannel: null,
  ecAnalytics: {}, // 微信小程序ec互动数据
};
const getters = {
  menusList: (state) => state.menusList,
  appletChannel: (state) => state.appletChannel,
  ecAnalytics: (state) => state.ecAnalytics,
}
const actions = {
  setSubscribe(_, params) {
    return subscribe(params).then((res) => {
      const subRes = get(res, 'data.subscribe')
      if (subRes) {
        uni.showToast({
          icon: 'none',
          title: MSG.SUCCESS,
        });
        return Promise.resolve()
      }
      uni.showToast({
        icon: 'none',
        title: MSG.REFUSE,
      });
      return Promise.reject()
    }).catch((e) => {
      uni.showToast({
        icon: 'none',
        title: MSG.REFUSE,
      });
      console.error('订阅失败', e)
      return Promise.reject()
    })
  },
  wxSubscribe({
    dispatch,
  }, params = {}) {
    const {
      type,
      keyWord,
      isSubscribed,
    } = params
    if (!type) {
      return type === TYPE_CODE.ORDER ? Promise.resolve() : Promise.reject()
    }
    if (isSubscribed) {
      // 接收订阅消息并且之前已经订阅过了
      uni.showToast({
        icon: 'none',
        title: MSG.SUBSCRIBED,
      });
      return Promise.resolve()
    }
    if (!uni.requestSubscribeMessage) {
      uni.showToast({
        icon: 'none',
        title: MSG.NEED_UPDATE,
      });
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      const ids = IDS[type]
      uni.requestSubscribeMessage({
        tmplIds: ids,
        success: async (res) => {
          if (ids.find((id) => res[id] === 'accept')) {
            // 接收订阅消息, 调用接口
            try {
              const actions = []
              for (const i in res) {
                if (res[i] === 'accept') {
                  actions.push(...(REMIND_WAY[type][i] || []))
                }
              }
              dispatch('setSubscribe', {
                keyword: keyWord,
                messageAction: actions,
              })
              resolve()
            } catch (error) {
              uni.showToast({
                icon: 'none',
                title: MSG.REFUSE,
              });
              type === TYPE_CODE.ORDER ? resolve() : reject()
              console.log(error)
            }
          } else if (ids.find((id) => res[id] === 'ban')) {
            // 权限问题
            uni.showToast({
              icon: 'none',
              title: MSG.NO_AUTH,
            });
            type === TYPE_CODE.ORDER ? resolve() : reject()
          } else {
            // 其他问题，订阅失败
            uni.showToast({
              icon: 'none',
              title: MSG.REFUSE,
            });
            type === TYPE_CODE.ORDER ? resolve() : reject()
          }
        },
        fail: (err) => {
          if (err.errCode === 20004) {
            uni.showToast({
              icon: 'none',
              title: MSG.NO_AUTH,
            });
          } else {
            uni.showToast({
              icon: 'none',
              title: MSG.REFUSE,
            });
          }
          type === TYPE_CODE.ORDER ? resolve() : reject()
        },
      })
    })
  },
  // 立即手动触发，催付提醒
  handSMSOrderPayRemind(_, orderNo) {
    if (!orderNo) return
    uni.request({
      url: `${CURRENT_HOST}/job/orderPayRemind?orderId=${orderNo}`,
    });
  },
  getMenus({
    commit,
  }) {
    return menusList().then((res) => {
      const list = get(res, 'data.shop.menus[0].children')
      commit('setMenusList', list)
      return list
    })
  },

  setAppletChannel({ commit }, channel) {
    commit('setAppletChannel', channel)
  },
  setEcAnalytics({ commit }, ecAnalytics) {
    commit('setEcAnalytics', ecAnalytics)
  },
  // 获取微信AccessToken
  getAccessToken() {
    return getAccessToken().then((res) => res.data)
  },
}
const mutations = {
  setMenusList(state, list = []) {
    state.menusList = list
  },
  setAppletChannel(state, value) {
    state.appletChannel = value
  },
  setEcAnalytics(state, value) {
    state.ecAnalytics = value
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
