import apollo from '../apollo';
import { qyUserInfoGql } from '../gqls'

export const qyUserInfo = (authCode) => apollo.query({
  query: qyUserInfoGql,
  variables: {
    authCode,
  },
  hideErrorMsg: true,
})
