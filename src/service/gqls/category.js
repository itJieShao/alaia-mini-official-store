import gql from 'graphql-tag';

export const categoryGql = gql`
query menuTree {
  shop {
    menuTree {
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
      spuCodes
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
        urlType
        picLink
        picLinkBlank
        picDes
        spuCodes
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
          urlType
          picLink
          picLinkBlank
          picDes
          spuCodes
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
            urlType
            picLink
            picLinkBlank
            picDes
            spuCodes
          }
        }
      }
      urlType
      picLink
      picLinkBlank
      picDes
    }
  }
}
`

export const categoryProductListGql = gql`
query productByCode ($codes: [String!]!) {
    shop {
        productByCode (codes: $codes) {
            code
            title
            onShelves
            images {
              url
            }
            skus {
              code
              salePrice {
                amount
              }
            }
        }
    }
}
`
