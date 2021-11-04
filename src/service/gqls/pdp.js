import gql from "graphql-tag";

export const styleInspiration = gql`
  query styleInspiration($code: String!) {
    shop {
      styleInspiration(code: $code) {
        id
        resources {
          id
          url
          source
        }
        codes
      }
    }
  }
`;

export const ProductByStyle = gql`
  query findProductByStyle($code: String!) {
    shop {
      findProductByStyle(styleCode: $code) {
        style
        code
        title
        onShelves
        subTitle
        description
        inventory
        sales
        listPrice {
          amount
          currencyCode
        }
        categories {
          path
          code
          name
          navFrontName
          imageUrl
        }
        salePrice {
          amount
          currencyCode
        }
        images {
          type
          url
        }
        attributes {
          code
          name
          frontName
          values {
            code
            displayName
            url
            frontName
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
          options {
            code
            frontName
            originCode
            value {
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
  }
`;

export const getHomeStyleInspirationGql = gql`
  query homeStyleInspiration {
    shop {
      homeStyleInspiration {
        id
        resources {
          id
          url
          source
        }
        codes
      }
    }
  }
`;

export const getProductDetails = gql`
  query productByCode($codes: [String!]!) {
    shop {
      productByCode(codes: $codes) {
        code
        title
        onShelves
        subTitle
        description
        inventory
        sales
        listPrice {
          amount
          currencyCode
        }
        salePrice {
          amount
          currencyCode
        }
        images {
          url
          type
        }
        labels {
          code
          frontName
          description
        }
        bodyMeasurements {
          unit
          category
          mapAttrs {
            attr
            relationAttr
          }
        }
        attributes {
          code
          name
          frontName
          originCode
          values {
            code
            displayName
            url
            frontName
          }
        }
        categories {
          path
          code
          name
          imageUrl
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
          options {
            code
            frontName
            originCode
            value {
              code
              name
              frontName
              images {
                url
              }
            }
          }
          showAttrList {
            code
            enable
            name
            sort
            attrType
            originCode
            attrValueList {
              code
              attrCode
              originCode
              frontName
            }
          }
          # subscribed
        }
        recommends {
          code
          title
          subTitle
          inventory
          sales
          productType
          sizeChart
          listTime
          preOrder
          seoTitle
          seoKeywords
          seoDescription
          customUrl
          style
          onShelves
          listPrice {
            amount
            currencyCode
          }
          salePrice {
            amount
            currencyCode
          }
          attributes {
            code
            name
            frontName
            values {
              code
              displayName
              url
              frontName
            }
          }
          images {
            url
          }
          skus {
            code
            inventory
            featuredType
            isEnabled
            salePrice {
              amount
              currencyCode
            }
            options {
              code
              frontName
              originCode
              value {
                code
                name
                frontName
                images {
                  url
                }
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
        }
        productType
        sizeChart
        listTime
        preOrder
        seoTitle
        seoKeywords
        seoDescription
        favorite {
          id
        }
        extAttribute {
          code
          name
          value
          resource {
            id
            url
          }
        }
      }
    }
  }
`;

export const addShopCart = gql`
  mutation cartAdd($inputs: [CartUpdateInput!]!) {
    cartAdd(inputs: $inputs) {
      cart {
        cartItems {
          skuCode
        }
      }
      userErrors {
        code
        message
      }
    }
  }
`;

export const productListGql = gql`
  query productByCode($codes: [String!]!) {
    shop {
      productByCode(codes: $codes) {
        code
        title
        onShelves
        subTitle
        description
        inventory
        sales
        listPrice {
          amount
          currencyCode
        }
        salePrice {
          amount
          currencyCode
        }
        images {
          url
          type
        }
        labels {
          code
          frontName
          description
        }
        attributes {
          code
          name
          frontName
          values {
            code
            displayName
            url
            frontName
          }
        }
        categories {
          path
          code
          name
          imageUrl
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
          options {
            code
            frontName
            originCode
            value {
              code
              name
              frontName
              images {
                url
              }
            }
          }
          # subscribed
        }
        productType
        sizeChart
        listTime
        preOrder
        seoTitle
        seoKeywords
        seoDescription
        favorite {
          id
        }
        extAttribute {
          code
          name
          value
          resource {
            id
            url
          }
        }
      }
    }
  }
`;
