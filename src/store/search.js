import {
  searchProduct,
} from '../service/apis/search'
import {
  get
} from '../utils/utilityOperationHelper'

const state = {
  defaultFilter: {
    keyword: '',
    businessCode: 'MOBILE',
    spuSaleStatuses: ['ON_SHELF'],
  },
  keyWord: '',
  searchProductResultList: [],
  isFocus: false,
  menuName: '',
  clearKeyWordFlag:"",
  clearSelectFlag:"",
};
const getters = {
  defaultFilter: (state) => state.defaultFilter,
  keyWord: (state) => state.keyWord,
  searchProductResultList: (state) => state.searchProductResultList,
  isFocus: (state) => state.isFocus,
  menuName: (state) => state.menuName,
}
const actions = {
  searchProduct({
    commit
  }, params) {
    return searchProduct(params).then((res) => {
      const list = get(res, 'data.shop.products.edges') || [];
      const pageInfo = get(res, 'data.shop.products.pageInfo') || {};
      const formatList = list.map((item) => item.node);
      const data = {
        list: formatList,
        pageInfo
      };
      return data;
    })
  },
  setkeyWord({
    commit
  }, value) {
    commit('setkeyWord', value || '')
  },
  setSearchProductResultList({
    commit
  }, list) {
    commit('setSearchProductResultList', list)
  },
  setFocus({
    commit
  }, value) {
    commit('setFocus', value)
  },
  setMenuName({
    commit
  }, name) {
    commit('setMenuName', name)
  },
};
const mutations = {
  setSearchPageType(state, type) {
    state.searchPageType = type;
  },
  setkeyWord(state, value) {
    state.keyWord = value
  },
  setSearchProductResultList(state, list = []) {
    state.searchProductResultList = list
  },
  setFocus(state, value) {
    state.isFocus = value
  },
  setMenuName(state, value) {
    state.menuName = value
  },
  clearKeyWord(state) {
    state.clearKeyWordFlag = new Date().getTime();
  },
  clearSelect(state) {
    state.clearSelectFlag = new Date().getTime();
  },
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
