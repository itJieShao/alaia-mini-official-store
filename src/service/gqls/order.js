import gql from 'graphql-tag';
// 创建订单
export const orderCreateGql = gql`
  mutation orderCreate($input: OrderCreateInput!) {
    orderCreate (input: $input) {
      order {
        code
        orderCode
        orderStatus
        orderTime
        receivedAmount {
          amount
          currencyCode
        }
        amount {
          amount
          currencyCode
        }
        account
        productAmount {
          amount
          currencyCode
        }
        freight {
          amount
          currencyCode
        }
        terminal
        distributionType
        externalOrderNo
        externalAccountId
        mobile
        email
        tax {
          amount
          currencyCode
        }
        activityDiscount {
          amount
          currencyCode
        }
        couponDiscount {
          amount
          currencyCode
        }
        prePayDeduct {
          amount
          currencyCode
        }
        payDeduct {
          amount
          currencyCode
        }
        valid
        frozen
        buyerMemo
        platformSource
        allowSplit
        cancelReason
        finishDatetime
        additionalServices {
          serviceType
          name
          memo
          amount
          extInfos
        }
        extInfos
        fullPaid
        currency
        logistics {
          cancelDatetime
          cancelReason
          deliveryOrderNo
          deliveryStatus
          deliveryType
          estimateArriveDatetime
          extInfos
          finishDatetime
          logisticsProviderCode
          logisticsProviderName
          memo
          orderNo
          returnId
          sendDatetime
          signedDatetime
          trackingNo
        }
        afterSalesOrders {
          code
          orderNo
          afterSalesOrderNo
          memo
        }
      }
      userErrors {
        code
        message
      }
    }
  }
`
// 取消订单
export const orderCancelGql = gql`
  mutation orderCancel($orderCode: String!) {
    orderCancel (orderId: $orderCode) {
      order {
        code
       }
    }
  }
`
export const postageGql = gql`
query postage($input: PostageTaxInput) {
  shop {
    postage(input: $input) {
      amount
      currencyCode
    }
  }
}
`
export const transportMethodsGql = gql`
query transportMethods {
  shop {
    transportMethods {
      id
      transportName
      transportMethod
      expressCompany
      expressCompanyCode
      expressTime
      remark
      imgUrl
      sortNo
    }
    additionalServices {
      type
      amount
    }
  }
}
`

export const cartItemCalculateGql = gql`
query cartItemCalculate($input: CartItemInput!) {
  customer {
    cartItemCalculate(input: $input) {
      amount {
        amount
        currencyCode
      }
      coupon {
        amount
        currencyCode
      }
      discount {
        amount
        currencyCode
      }
      productAmount {
        amount
        currencyCode
      }
      postage {
        amount
        currencyCode
      }
      tax {
        amount
        currencyCode
      }
      additionalServiceFee {
        amount
        currencyCode
      }
      additionalServices 
      activities {
        id
        name
        type
        ruleDesc
        url
        promoRewardAmount {
          amount
          currencyCode
        }
        gifts {
          gift {
            name
            number
            inventory
            sku {
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
              inventory
              options {
                code
                frontName
                value {
                  code
                  name
                  displayName
                  url
                  frontName
                  images {
                    url
                  }
                  thumbnails {
                    url
                  }
                }
              }
              promotions {
                code
                name
                description
                beginTime
                url
              }
              activityPrice {
                activityLabel
                activityName
                promotionPrice {amount
                currencyCode}
              }
              product {
                code
                title
                onShelves
                subTitle
                inventory
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
                }
              }
              subscribed
            }
          }
          cartItem {
            skuCode
            quantity
            sku {
              code
              salePrice {
                amount
                currencyCode
              }
              inventory
            }
          }
        }
      }
      items {
        skuCode
        quantity
        subtotalBeforeDiscount
        discount
        tax
        gst
      }
      guideInfo {
        guideId
        o2oShopCode
      }
    }
  }
}
`

export const ordersGql = gql`
query orders($pageInput: PageInput, $months: Int = 999) {
  customer {
    orders (pageInput: $pageInput, months: $months){
      edges {
        cursor
        node {
          code
          orderCode
          externalOrderNo
          orderStatus
          orderTime
          cancelReason
          scheduleCancelTime
          # paySurplusTime
          receivedAmount {
            amount
            currencyCode
          }
          amount {
            amount
            currencyCode
          }
          productAmount {
            amount
            currencyCode
          }
          orderLines {
            skuCode
            spuCode
            name
            quantity
            image
            amount {
              amount
              currencyCode
            }
            attribute
            skuProperties
            extInfos
            isGift
          }
          receiptInfo {
            name
            mobile
            province
            city
            district
            address
          }
          extInfos
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
        totalCount
      }
    }
  }
}
`

export const productBySkucodesGql = gql`
  query productBySkuCodes ($skuCodes: [String!]!){
    shop {
      productBySkuCodesNew (skuCodes: $skuCodes) {
        skus {
          code
          salePrice {
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
          product {
            title
            code
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
            images {
              url
              type
            }
          }
          options {
            code
            name
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
      }
    }
  }
`

export const regionsGql = gql`
query chineseRegions {
  chineseRegions {
    code
    name
    children {
      code
      name
      
      children {
        code
        name
      }
    }
  }
}`
// 查询订单详情
export const orderDetailGql = gql`
query orderDetail($code: String!, $type: TypeName!) {
  node(code: $code, type: $type) {
  	...on Order {
      code
      orderCode
      externalOrderNo
      orderStatus
      orderTime
      scheduleCancelTime
      paySurplusTime
      cancelReason
      receivedAmount {
        amount
        currencyCode
      }
      amount {
        amount
        currencyCode
      }
      productAmount {
        amount
        currencyCode
      }
      freight{
        amount
        currencyCode
      }
      orderLines {
        skuCode
        spuCode
        salePrice {
        amount
        currencyCode
        }
        name
        quantity
        image
        amount {
          amount
          currencyCode
        }
        attribute
        skuProperties
        extInfos
        isGift
      }
      orderInvoice {
        type
        eInvoiceUrl
        titleType
        title
        invoiceNo
        taxNo
        content
        carrier
        recipient {
          mobile
          mail
        }
      }
      receiptInfo {
        name
        mobile
        province
        city
        district
        address
      }
      extInfos
      logistics{
        trackingNo
        logisticsProviderName
      }
      logisticsRoutes{
        transNo
        logisticsRouteInfo{
          modifyTime
          status
          description
        }
      }
    }    
  }
}`
//订单支付
export const orderPayGql = gql`
mutation orderPay($input: PaymentInput!){
  pay(input: $input){
    userErrors{
      message
      code
      field
    }
    response{
      form
      productType
      weixinTimestamp
      weixinWxPackage
      weixinNonceStr
      weixinSignType
      weixinSign
    }
  }
}`

export const orderInvoiceGql = gql`
  mutation orderInvoice($orderCode: String!, $input: InvoiceInput!) {
    orderInvoice(orderCode: $orderCode, input: $input) {
      orderNo
      type
      eInvoiceUrl
      titleType
      title
      invoiceNo
      taxNo
      content
      carrier
      recipient {
        name
        mobile
        mail
      }
    }
  }
`

// 物流信息
export const omsLogisticsGql = gql`
query omsLogistics($externalOrderNo: String!) {
  omsLogistics(externalOrderNo: $externalOrderNo) {
    externalOrderNo
    trackingNo
    logisticsProviderName
    status
    updateTime
  }
}`
