import gql from 'graphql-tag'

export const createUserActionGql = gql`
mutation createUserAction($input: CreateUserActionInput!) {
  createUserAction(input: $input)
}
`
