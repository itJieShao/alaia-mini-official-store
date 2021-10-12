import gql from 'graphql-tag';

export const searchProductGql = gql`
query products($filters: ProductFilterInput!, $sort: SortInput, $pageInput: PageInput) {
  shop {
    products(filters: $filters, sort: $sort, pageInput: $pageInput) {
      edges {
        cursor
        node {
          code
          title
          onShelves
          subTitle
          description
          inventory
          listPrice {
            amount
            currencyCode
          }
          salePrice {
            amount
            currencyCode
          }
          maxSkuSalePrice
          minSkuSalePrice
          images {
            url
            type
          }
          attributes {
            code
            frontName
            values {
              code
              displayName
              url
              frontName
              images {
                url
              }
            }
          }
          options {
            code
            frontName
            values {
              code
              displayName
              url
              frontName
              name
              images {
                url
                images {
                  url
                }
              }
              thumbnails {
                url
                images {
                  url
                }
              }
            }
          }
          skus {
            code
            weight
            extentionCode
            featuredType
            sales
            inventory
            preDays
            code
            isEnabled
            listPrice {
              amount
              currencyCode
            }
            salePrice {
              amount
              currencyCode
            }
            options{
              code
              frontName
              value{
                code
                name
                frontName
                images {
                  url
                }
              }
            }
          }
        }
      }
     pageInfo {
      	hasNextPage
      	hasPreviousPage
        endCursor
        totalCount
    	}
    }
  }
}`
