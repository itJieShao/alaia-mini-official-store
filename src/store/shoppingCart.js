import { getCartInfoData } from '../service/apis/cart'
import { get } from '../utils/utilityOperationHelper'

const state = {
  cartNumber: 0,
  selectCart: [],
  cartAmount: 0,
};
const getters = {
  cartNumber: (state) => state.cartNumber,
}
const actions = {
  updateCartNumber({ commit }, num) {
    commit('updateCartNumber', num)
  },
  updateSelectCart({ commit }, data) {
    commit('updateSelectCart', data)
  },
  updateCartAmount({ commit }, num) {
    commit('updateCartAmount', num)
  },
  queryCartInfo({ commit }) {
    return getCartInfoData().then((res) => {
      const cartItems = get(res, 'data.customer.cart.cartItems') || [];
      const selectCart = [];
      let cartNum = 0;
      let cartAmount = 0;
      cartItems.forEach((item) => {
        // 计算金额排除无效商品
        if (item.selected && get(item, 'sku.product.onShelves') && get(item, 'sku.inventory') > 0) {
          cartNum += item.quantity;
          selectCart.push(item);
        }
        // 计算除无效商品外 购物车商品总数
        if (get(item, 'sku.product.onShelves') && get(item, 'sku.inventory') > 0) {
          cartAmount += item.quantity;
        }
      });
      commit('updateCartNumber', cartNum)
      commit('updateSelectCart', selectCart)
      commit('updateCartAmount', cartAmount)
      return cartItems
    })
  },
}
const mutations = {
  updateCartNumber(state, num) {
    state.cartNumber = num;
  },
  updateSelectCart(state, data) {
    state.selectCart = data;
  },
  updateCartAmount(state, num) {
    state.cartAmount = num;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
