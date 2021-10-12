import apollo from '../apollo';
import { searchProductGql } from '../gqls'

export const searchProduct = (payload) => apollo.query({
  query: searchProductGql,
  variables: payload,
});
