import gql from 'graphql-tag';

export const filterConditionGql = gql`
query filterCondition($filters: ProductFilterInput!) {
  shop {
    filterCondition(filters: $filters) {
      categories {
        code
        name
        frontName
        categoryPath
        count
      }
      attributes {
        attributeType
        code
        name
        values {
          key
          value
          frontName
          imageUrl
          total
        }
      }
      brands {
        code
        name
        description
        imageUrl
      }
      salePrices {
        salePrice {
          amount
          currencyCode
        }
        count
      }
    }
  }
}`
