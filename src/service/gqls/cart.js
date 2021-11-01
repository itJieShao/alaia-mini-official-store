import gql from 'graphql-tag';

export const cartGql = gql`
      query cart {
        customer{
          cart{
            cartItems{
              selected
              quantity
              lineId
              sku{
                code
                isEnabled
                inventory
                salePrice{
                  amount
                  currencyCode
                }
                showAttrList{
                  code
                  enable
                  name
                  sort
                  attrType
                  originCode
                  attrValueList{
                    code
                    attrCode
                    originCode
                    frontName
                  }
                }
                options {
                  code
                  frontName
                  originCode
                  value {
                    code
                    name
                    displayName
                    frontName
                  }
                }
                product{
                  code
                  title
                  onShelves
                  subTitle
                  description
                  inventory
                  skus{
                    code
                    options {
                      code
                      frontName
                      value {
                        code
                        name
                        displayName
                        frontName
                      }
                    }
                  }
                  options {
                    code
                    frontName
                    values {
                      code
                      name
                      displayName
                      frontName
                    }
                  }
                  attributes{
                    code
                    frontName
                    name
                    values {
                      code
                      displayName
                      url
                      frontName
                    }
                  }
                  images{
                    url
                    images {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

export const cartAddGql = gql`
  mutation cartAdd($inputs: [CartUpdateInput!]!) {
    cartAdd(inputs: $inputs){
      userErrors{
        code
        message
      }
    }
  }
`

export const cartUpdateGql = gql`
  mutation cartUpdate($inputs: [CartUpdateInput!]!) {
    cartUpdate(inputs: $inputs){
      userErrors{
        code
        message
      }
      cart{
        cartItems{
          selected
          quantity
          lineId
          sku{
            code
            isEnabled
            inventory
            salePrice{
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
                displayName
                frontName
              }
            }
            showAttrList{
              code
              enable
              name
              sort
              attrType
              originCode
              attrValueList{
                code
                attrCode
                originCode
                frontName
              }
            }
            product{
              code
              title
              onShelves
              subTitle
              description
              inventory
              skus{
                code
                options {
                  code
                  frontName
                  originCode
                  value {
                    code
                    name
                    displayName
                    frontName
                  }
                }
              }
              attributes{
                code
                frontName
                name
                values {
                  code
                  displayName
                  url
                  frontName
                }
              }
              images{
                url
                images {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`

export const cartDeleteGql = gql`
  mutation cartDelete($lineIds: [String!]!) {
    cartDelete(lineIds: $lineIds){
      userErrors{
        code
        message
      }
      cart{
        cartItems{
          selected
          quantity
          sku{
            code
            isEnabled
            inventory
            salePrice{
              amount
              currencyCode
            }
            showAttrList{
              code
              enable
              name
              sort
              attrType
              originCode
              attrValueList{
                code
                attrCode
                originCode
                frontName
              }
            }
            options {
              code
              frontName
              originCode
              value {
                code
                name
                displayName
                frontName
              }
            }
            product{
              code
              title
              onShelves
              subTitle
              description
              inventory
              attributes{
                code
                frontName
                name
                values {
                  code
                  displayName
                  url
                  frontName
                }
              }
              images{
                url
                images {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`

export const cartSkuStatusUpdateGql = gql`
  mutation cartSkuStatusUpdate($input: CartSkuStatusInput) {
    cartSkuStatusUpdate(input: $input){
      userErrors{
        code
        message
      }
      cart{
        cartItems{
          selected
          quantity
          lineId
          sku{
            code
            isEnabled
            inventory
            salePrice{
              amount
              currencyCode
            }
            showAttrList{
              code
              enable
              name
              sort
              attrType
              originCode
              attrValueList{
                code
                attrCode
                originCode
                frontName
              }
            }
            options {
              code
              frontName
              originCode
              value {
                code
                name
                displayName
                frontName
              }
            }
            product{
              code
              title
              onShelves
              subTitle
              description
              inventory
              attributes{
                code
                frontName
                values {
                  code
                  displayName
                  url
                  frontName
                }
              }
              images{
                url
                images {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`

export const productByCodeGql = gql`
  query getViewData( $codes: [String!]!) {
    shop {
      productByCode(codes: $codes){
          code
          title
          onShelves
          subTitle
          description
          inventory
          attributes{
            code
            frontName
            values {
              code
              displayName
              url
              frontName
            }
          }
          salePrice{
            amount
            currencyCode
          }
          images{
            url
            images {
              url
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
              subscribed
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
    }
  }`


export const replaceableSkusGql = gql`
  query getReplaceableSkus( $codes: [String!]!) {
    shop {
      productByCode(codes: $codes){
        code
        skus {
          inventory
          code
          showAttrList{
            code
            enable
            name
            sort
            attrType
            originCode
            attrValueList{
              code
              attrCode
              originCode
              frontName
            }
          }
          options {
            code
            frontName
            originCode
            name
            value {
              code
              name
              displayName
              frontName
            }
          }
        }
      }
    }
  }
`