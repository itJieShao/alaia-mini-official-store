import apollo from '../apollo';
import { shopGql } from '../gqls'

export const shopApi = (params) => apollo.query({
  query: shopGql,
  variables: params
});
