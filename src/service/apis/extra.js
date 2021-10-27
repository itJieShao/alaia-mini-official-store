import apollo from '../apollo';
import { skuProductGql  } from '../gqls'


export const getSkuProductListApi = (payload) => apollo.query({
    query: skuProductGql,
    variables: {
      ...payload,
    },
})