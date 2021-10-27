import gql from 'graphql-tag';

// skuCode查询商品
export const skuProductGql = gql`
query skuProducts ($codes: [String!]!) {
  shop {
    productByCode(codes: $codes) { 
        title 
        subTitle 
        description
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
        maxSkuSalePrice 
        minSkuSalePrice 
        maxSkuListPrice 
        minSkuListPrice
    }
  }
}`