import apollo from "../apollo";
import {
  getHomeStyleInspirationGql,
  getProductDetails,
  addShopCart,
  productListGql,
  styleInspiration,
  ProductByStyle
} from "../gqls";

export const getHomeStyleInspiration = payload =>
  apollo.mutate({
    mutation: getHomeStyleInspirationGql,
    variables: payload
  });

export const getPDPstyleInspiration = payload =>
  apollo.mutate({
    mutation: styleInspiration,
    variables: payload
  });

export const getProductDetailsAction = payload =>
  apollo.mutate({
    mutation: getProductDetails,
    variables: payload
  });

export const addShopCartApi = payload =>
  apollo.mutate({
    mutation: addShopCart,
    variables: {
      inputs: payload
    },
    hideErrorMsg: true
  });

export const productList = payload =>
  apollo.mutate({
    mutation: productListGql,
    variables: {
      codes: payload
    }
  });
export const findProductByStyle = payload =>
  apollo.mutate({
    mutation: ProductByStyle,
    variables: payload
  });
