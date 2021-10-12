import gql from 'graphql-tag';

export const qyUserInfoGql = gql`
  query staffInfo($authCode: String!) {
   staffInfo(authCode: $authCode) {
     staffCode
     storeCode
   }
  }
`
