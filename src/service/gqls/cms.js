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