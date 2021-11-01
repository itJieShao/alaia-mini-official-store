import Vue from 'vue'
import Vuex from 'vuex'
import order from './order'
import shoppingCart from './shoppingCart'
import common from './common'
import cms from './cms'
import search from './search'
import newSearch from './new_search'
import user from './user'
import product from './product'
import userAction from './userAction'
import qy from './qy'
import globle from './globle'
import category from './category'
import goodsFilter from './goodsFilter'
import shop from './shop'
import wish from './wish'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    order,
    shoppingCart,
    common,
    cms,
    search,
    newSearch,
    user,
    product,
    userAction,
    qy,
    globle,
    category,
    goodsFilter,
    shop,
    wish
  },
})

export default store
