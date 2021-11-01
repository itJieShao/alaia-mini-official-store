import apollo from '../apollo';
import {
  cartGql, cartAddGql, cartUpdateGql, cartDeleteGql,
  cartSkuStatusUpdateGql,
  productByCodeGql,
  replaceableSkusGql
} from '../gqls'

// 根据商品code获取商品列表
export const getProductByCode = (params) => apollo.query({
  query: productByCodeGql,
  fetchPolicy: 'no-cache',
  variables: { codes: params },
})

export const getCartInfoData = () => apollo.query({
  query: cartGql,
  fetchPolicy: 'no-cache',
})

export const getReplaceableSkusDataApi = (params) => apollo.query({
  query: replaceableSkusGql,
  fetchPolicy: 'no-cache',
  variables: { codes: params },
})

// 添加购物车
export const cartAdd = (params) => apollo.mutate({
  mutation: cartAddGql,
  fetchPolicy: 'no-cache',
  variables: {
    inputs: params,
  },
})

// 变更购物车内的商品数量
export const cartUpdateNum = (params) => apollo.mutate({
  mutation: cartUpdateGql,
  fetchPolicy: 'no-cache',
  variables: {
    inputs: params,
  },
  hideErrorMsg: true,
})

// 删除购物车
export const cartDelete = (params) => apollo.mutate({
  mutation: cartDeleteGql,
  fetchPolicy: 'no-cache',
  variables: {
    lineIds: params,
  },
})

// 更变购物车状态
export const cartSkuStatusUpdate = (params) => apollo.mutate({
  mutation: cartSkuStatusUpdateGql,
  fetchPolicy: 'no-cache',
  variables: {
    input: params,
  },
})
