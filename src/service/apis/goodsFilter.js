import apollo from '../apollo';
import { filterConditionGql } from '../gqls'

export const filterData = (payload) => apollo.query({
  query: filterConditionGql,
  variables: payload,
});
