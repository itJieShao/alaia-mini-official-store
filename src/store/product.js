/* eslint-disable import/no-cycle */
import { productList } from '../service/apis/pdp';
import { productBySkucodes } from '../service/apis/order'
import { get } from '../utils/utilityOperationHelper'

const state = {};
const getters = { }
const actions = {
  getProductList(_, codes) {
    return productList(codes).then((res) => get(res, 'data.shop.productByCode') || [])
  },
  getProductListBySku(_, skuCodes) {
    return productBySkucodes(skuCodes).then((res) => get(res, 'data.shop.querySkus') || [])
  },
}
const mutations = {};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
