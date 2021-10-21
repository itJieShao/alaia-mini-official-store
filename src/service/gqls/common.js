import gql from 'graphql-tag';

export const subscribeGql = gql`
mutation subscribe($input:  SubscribeInput!) {
  subscribe(input: $input)
}`

export const menuGql = gql`
query menus {
  shop {
    menus {
      code
      name
      order
      icon
      url
      parentCode
      remark
      title
      subTitle
      display
      tag
      picFirst
      blank
      picLink
      picDes
      children {
        code
      name
      order
      icon
      url
      parentCode
      remark
      title
      subTitle
      display
      tag
      picFirst
      blank
      picLink
      picDes
      }
    }
  }
}`
