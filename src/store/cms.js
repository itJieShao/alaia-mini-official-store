import { getViewData, getCmsContentListApi, getCmsContentGuessLikeApi } from '../service/apis/cms';
import { CMS_CONFIG_LIST } from '@/constants/cms';
import { get } from '../utils/utilityOperationHelper'
import log from '../utils/log'

const state = {
  defaultParams: {
    modelCode: 'LP',
    browseEnv: 'PC',
    isPublish: true,
  },
  pageCode: '',
  cmsContentMap: {},
  // 猜你喜欢配置
  guessLikeCmsContentMap: {}
};

const getters = {
  pageCode: (state) => state.pageCode,
  cmsContentMap: (state) => state.cmsContentMap
}

const actions = {
  async getCmsContentMapData ({ state, commit }) {
    const { cmsContentMap } = state;
    if (Object.keys(cmsContentMap).length === 0) {
      const templateWithContentCodes = CMS_CONFIG_LIST.map(c => `${c.templateCode}:${c.contentCode}`).join(',');
      const res = await getCmsContentListApi({ templateWithContentCodes });
      const resData = get(res, 'data.shop.templateDataList').reduce((prev, cur) => {
        const { contentCode } = cur;
        if (!prev.hasOwnProperty(cur.contentCode)) {
          prev[contentCode] = cur.content;
        }
        return prev;
      }, {});
      commit('setCmsContentMap', resData);
      return resData;
    } else {
      return cmsContentMap;
    }
  },
  async getGuessLikeCmsContentMapData ({ state, commit }) {
    const { guessLikeCmsContentMap } = state;
    if (Object.keys(guessLikeCmsContentMap).length === 0) {
      const res = await getCmsContentGuessLikeApi();
      const resData = get(res, 'data.shop');
      commit('setGuessLikeCmsContentMap', resData);
      return resData;
    } else {
      return guessLikeCmsContentMap;
    }
  },
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
  setCmsContentMap(state, list) {
    state.cmsContentMap = list;
  },
  setGuessLikeCmsContentMap (state, map) {
    state.guessLikeCmsContentMap = map;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
