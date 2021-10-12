import apollo from '../apollo';
import { viewDataGql } from '../gqls'

export const getViewData = (payload) => apollo.mutate({
  mutation: viewDataGql,
  variables: {
    input: payload,
  },
});
