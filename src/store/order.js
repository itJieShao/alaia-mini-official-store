import {
  cartItemCalculate,
  getOrderList,
  getRegionsList,
  getOrderDetail,
  orderPay,
  orderInvoice,
  orderCreate,
  transportMethods,
  omsLogistics,
  orderCancel
} from '../service/apis/order'
import regionList from '../data/region-backend'
import {
  get,
} from '../utils/utilityOperationHelper'
import {
  STATUS_CODE,
} from '../constants/order'
import {
  ORDER_INFO,
} from '../constants/user'
import {
  getErrorMessage,
} from '../constants/errorCode'

const state = {
  activities: [],
  regionsList: [],
  // 发票信息
  invoiceInfo: {
    isNeed: false,
  },
  addressInfo: null,
  // 订单列表
  orderPageInfo: {
    endCursor: 'MA==',
    hasNextPage: true,
  },
}
const getters = {
  regionsList: (state) => state.regionsList,
  invoiceInfo: (state) => state.invoiceInfo,
  orderPageInfo: (state) => state.orderPageInfo,
}
const actions = {
  getCartItem({
    commit,
  }, params) {
    return cartItemCalculate(params).then((res) => {
      const result = get(res, 'data.customer.cartItemCalculate')
      commit('setActivities', get(result, 'activities'))
      return result
    })
  },
  clearActivities({
    commit,
  }) {
    commit('setActivities', [])
  },
  getOrderList({
    commit,
  }, params = {}) {
    return getOrderList({
      ...{
        first: 50,
      },
      ...params,
    }).then((res) => {
      commit('setOrderPageInfo', get(res, 'data.customer.orders.pageInfo'))
      return get(res, 'data.customer.orders')
    })
  },
  getRegionsList({
    commit, getters,
  }) {
    if (getters.regionsList && getters.regionsList.length > 0) {
      return getters.regionsList;
    }
    return getRegionsList().then((res) => {
      const regions = get(res, 'data.chineseRegions')
      commit('setRegionsList', regions)
      return regions
    }).catch((e) => {
      console.log('数据查询失败', e)
      commit('setRegionsList', regionList)
      return regionList
    })
  },

  // 订单支付
  async orderPay({
    rootGetters,
    dispatch,
  }, {
    orderNo,
    isFirstPay = false,
  } = {}) {
    if (!orderNo) {
      return Promise.reject(Error('订单支付失败, 订单号不存在'))
    }
    try {
      const res = await getOrderDetail(orderNo)
      const orderInfo = get(res, 'data.node')
      if (orderInfo.orderStatus !== STATUS_CODE.WAIT_PAY) {
        return Promise.reject(Error('订单支付失败, 订单状态已失效'))
      }
      const payRes = await orderPay({
        orderId: orderNo,
        channelType: 'WEIXIN',
        paymentType: 'APPLET',
        amount: get(orderInfo, 'amount'),
        orderDesc: get(orderInfo, 'orderLines[0].name'),
        returnUrl: '/pages/order/index',
        extendParams: {
          productId: get(orderInfo, 'orderLines[0].spuCode'),
          openId: rootGetters['user/openId'],
        },
      })
      console.log('支付信息', payRes)
      const errors = get(payRes, 'data.pay.userErrors')
      if (errors && errors.length > 0) {
        return Promise.reject(Error(errors[0]))
      }
      return new Promise((resolve, reject) => {
        uni.requestPayment({
          provider: 'weixin',
          timeStamp: get(payRes, 'data.pay.response.weixinTimestamp'),
          nonceStr: get(payRes, 'data.pay.response.weixinNonceStr'),
          package: get(payRes, 'data.pay.response.weixinWxPackage'),
          signType: get(payRes, 'data.pay.response.weixinSignType'),
          paySign: get(payRes, 'data.pay.response.weixinSign'),
          success: () => {
            resolve()
          },
          fail: (wxError) => {
            let errMsg
            switch (wxError.errMsg) {
              case 'requestPayment:fail cancel':
                errMsg = '支付已取消'
                break;
              case 'requestPayment:fail (detail message)':
                errMsg = '调用支付失败'
                break
              default:
                errMsg = '支付失败'
            }
            reject(Error(errMsg))
          },
          complete: () => {
            // if (isFirstPay) {
            //   dispatch('common/handSMSOrderPayRemind', orderNo, {
            //     root: true,
            //   })
            // }
          },
        })
      })
    } catch (error) {
      return Promise.reject(Error('订单支付失败'))
    }
  },
  // 设置地址信息
  setAddressInfo({ commit }, payload) {
    commit('setAddressInfo', payload)
  },
  // 设置发票信息
  setInvoiceInfo({
    commit,
  }, params) {
    commit('setInvoiceInfo', params)
  },
  // 取消订单
  orderCancel(_, code) {
    return orderCancel(code).then((res) => get(res, 'data.node'))
  },
  getOrderDetail(_, code) {
    return getOrderDetail(code).then((res) => get(res, 'data.node'))
  },
  // 补开发票信息
  setOrderInvoice(_, params) {
    const {
      orderCode,
    } = params
    delete params.orderCode
    delete params.isNeed
    return orderInvoice(orderCode, params).then((res) => {
      const errors = get(res, 'errors') || []
      return !(errors.length > 0)
    })
  },

  // 订单创建
  orderCreate(_, params) {
    uni.showLoading({
      title: '加载中...',
    })
    return orderCreate(params).then((res) => {
      console.log(res, '-------创建订单')
      uni.hideLoading()
      const errors = get(res, 'errors')
      if (errors && errors.length > 0) {
        uni.showToast({
          title: getErrorMessage(errors[0].code, errors[0].message),
          icon: 'none',
          duration: 3000,
        })
        return Promise.reject(Error(errors[0].message))
      }
      uni.removeStorageSync(ORDER_INFO)
      return get(res, 'data.orderCreate.order')
    })
  },
  transportMethods(_) {
    return transportMethods().then((res) => get(res, 'data.shop.transportMethods[0]'))
  },
  omsLogistics(_, code) {
    return omsLogistics(code).then((res) => get(res, 'data.omsLogistics') || [])
  },
}
const mutations = {
  setActivities(state, activities) {
    state.activities = activities || []
  },
  setRegionsList(state, list) {
    state.regionsList = list || []
  },
  setInvoiceInfo(state, info) {
    state.invoiceInfo = info || {
      isNeed: false,
    }
  },
  setAddressInfo(state, info) {
    state.addressInfo = info
  },
  setOrderPageInfo(state, value) {
    state.orderPageInfo = value
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
