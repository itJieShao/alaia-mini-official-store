import apollo from '../apollo';

import {
  orderCreateGql,
  postageGql,
  transportMethodsGql,
  cartItemCalculateGql,
  ordersGql,
  regionsGql,
  orderDetailGql,
  orderPayGql,
  orderInvoiceGql,
  omsLogisticsGql,
  orderCancelGql,
  productByCodeGql,
  productBySkucodesGql
} from '../gqls'

export const orderCreate = (payload) => apollo.mutate({
  mutation: orderCreateGql,
  variables: {
    input: payload,
  },
  hideErrorMsg: true,
});
export const getPostage = (input) => apollo.query({
  query: postageGql,
  variables: {
    input,
  },
})
// 取消订单
export const orderCancel = (code) => apollo.mutate({
  mutation: orderCancelGql,
  variables: {
    orderCode: code
  },
})
export const transportMethods = () => apollo.query({
  query: transportMethodsGql,
})

export const cartItemCalculate = (input) => apollo.query({
  query: cartItemCalculateGql,
  variables: {
    input,
  },
})

export const getOrderList = (input) => apollo.query({
  query: ordersGql,
  variables: {
    pageInput: input,
  },
})

export const getRegionsList = () => apollo.query({
  query: regionsGql,
})

export const getOrderDetail = (code) => apollo.query({
  query: orderDetailGql,
  variables: {
    code,
    type:"Order"
  },
})

export const productBySkucodes = (skuCodes) => apollo.query({
  query: productBySkucodesGql,
  variables: { skuCodes },
})

export const orderPay = (input) => apollo.mutate({
  mutation: orderPayGql,
  variables: {
    input,
  },
  hideErrorMsg: true,
})

export const orderInvoice = (code, input) => apollo.mutate({
  mutation: orderInvoiceGql,
  variables: {
    orderCode: code,
    input,
  },
})

export const omsLogistics = (code) => apollo.query({
  query: omsLogisticsGql,
  variables: {
    externalOrderNo: code,
  },
})
