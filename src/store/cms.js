import { getViewData } from '../service/apis/cms';
import { get } from '../utils/utilityOperationHelper'
import log from '../utils/log'

const state = {
  defaultParams: {
    modelCode: 'LP',
    browseEnv: 'PC',
    isPublish: true,
  },
  pageCode: '',
};
const getters = {
  pageCode: (state) => state.pageCode,
}
const actions = {
  getViewData({ state, commit }, code) {
    commit('setPageCode', code)
    return getViewData({ ...state.defaultParams, smodelCode: code }).then((res) => {
      log.setFilterMsg('cms')
      log.info('----获取cms数据---', code, res)
      return get(res, 'data.shop.viewData')
    }).catch((error) => {
      log.setFilterMsg('cms-error')
      log.error('----获取cms数据---', code, error)
    })
  },
  getViewDataPLP({ commit }, code) {
    commit('setPageCode', code)
    return getViewData({ ...state.defaultParams, smodelCode: code }).then((res) => get(res, 'data.shop.viewData'))
  },
}
const mutations = {
  setPageCode(state, code) {
    state.pageCode = code
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
