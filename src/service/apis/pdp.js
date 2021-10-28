import apollo from '../apollo';
import { getHomeStyleInspirationGql, getProductDetails, addShopCart, productListGql } from '../gqls'

export const getHomeStyleInspiration = (payload) => apollo.mutate({
  mutation: getHomeStyleInspirationGql,
  variables: payload,
});

export const getProductDetailsAction = (payload) => apollo.mutate({
  mutation: getProductDetails,
  variables: payload,
});

export const addShopCartApi = (payload) => apollo.mutate({
  mutation: addShopCart,
  variables: {
    inputs: payload,
  },
  hideErrorMsg: true,
})

export const productList = (payload) => apollo.mutate({
  mutation: productListGql,
  variables: {
    codes: payload,
  },
})
