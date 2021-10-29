import gql from 'graphql-tag';

export const viewDataGql = gql`
query getViewData($input: ViewDataQueryInput!) {
  shop {
    viewData(input: $input) {
      position
      type
      module
      value
    }
  }
}
`

export const cmsContentGql = gql`
query getCmsContent ($templateCode: String!, $contentCode: String!) {
  shop {
    templateData(templateCode:$templateCode, contentCode:$contentCode)
  }
}`


export const cmsContentListGql = gql`
query getCmsContentList ($templateWithContentCodes: String!) {
  shop {
    templateDataList (templateWithContentCodes: $templateWithContentCodes) {
      templateCode
      contentCode
      content
    }
  }
}`

export const cmsContentGuessLikeGql = gql`
query getCmsContentGuessLike {
  shop {
    plpGuessLike
    searchGuessLike
    cartGuessLike
    favoriteGuessLike
  }
}`