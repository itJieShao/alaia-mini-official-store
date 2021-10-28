/* eslint-disable import/no-cycle */
import { productList,getHomeStyleInspiration } from '../service/apis/pdp';
import { productBySkucodes } from '../service/apis/order'
import { get } from '../utils/utilityOperationHelper'

const state = {
  homeStyleInspiration:[],
};
const getters = { 
  homeStyleInspiration: (state) => state.homeStyleInspiration,
}
const actions = {
  getHomeStyleInspiration({commit}, codes) {
    getHomeStyleInspiration().then((res) => {
      const homeStyleInspiration = get(res, 'data.shop.homeStyleInspiration') || [];
      commit("setHomeStyleInspiration",homeStyleInspiration)
    })
  },
  getProductList(_, codes) {
    return productList(codes).then((res) => get(res, 'data.shop.productByCode') || [])
  },
  getProductListBySku(_, skuCodes) {
    return productBySkucodes(skuCodes).then((res) => get(res, 'data.shop.querySkus') || [])
  },
}
const mutations = {
  setHomeStyleInspiration(state, homeStyleInspiration) {
    state.homeStyleInspiration = homeStyleInspiration
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
