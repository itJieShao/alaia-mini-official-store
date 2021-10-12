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
