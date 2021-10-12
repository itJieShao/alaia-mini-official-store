import apolloClient from '../apollo';
import {
  categoryGql,
  categoryProductListGql
} from '../gqls'
export const categoryData = (payload) => apolloClient.query({
  query: categoryGql
});

export const categoryProductList = (payload) => apolloClient.mutate({
  mutation: categoryProductListGql,
  variables: {
    codes: payload,
  },
})
