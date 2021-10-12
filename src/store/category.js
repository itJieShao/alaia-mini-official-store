import { categoryData,categoryProductList } from '../service/apis/category';
import { get } from '../utils/utilityOperationHelper'

const state = {
    categoryData:[]
};
const getters = {
  categoryData: (state) => state.categoryData,
}
const actions = {
  categoryProductList(_, codes) {
    return categoryProductList(codes).then((res) => get(res, 'data.shop.productByCode') || [])
  },
  getCategoryData({ commit }) {
    return categoryData({}).then((res) => {
      const data = get(res, 'data.shop.menuTree')
      return data;
    }).catch((error) => {
      console.log(error)
    })
  },
}
const mutations = {
  setCategoryData(state, data) {
    state.categoryData = data
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
