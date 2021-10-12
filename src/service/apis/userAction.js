import apollo from '../apollo';
import { createUserActionGql } from '../gqls'

export const createUserActionApi = (params) => apollo.mutate({
  mutation: createUserActionGql,
  fetchPolicy: 'no-cache',
  variables: {
    input: params,
  },
})
