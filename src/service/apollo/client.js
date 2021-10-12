import gql from 'graphql-tag';
import fetch from './fetch'
import { get } from '../../utils/utilityOperationHelper'

function getGqlString(doc) {
  return doc.loc && doc.loc.source.body;
}

export class GraphQLClient {
  url

  options

  constructor(url, options) {
    this.url = url
    this.options = options || {}
  }

  async request(query, variables, requestParams) {
    const { headers, ...others } = this.options
    const operationName = get(gql(query), 'definitions[0].name.value') || ''
    const body = JSON.stringify({
      query,
      variables: variables || undefined,
      operationName,
    })
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body,
      ...others,
    }, { ...requestParams, operationName })
    return getResult(response)

    // if (response.ok && !result.errors && result.data) {
    //   return result.data
    // }
    // const errorResult = typeof result === 'string' ? { error: result } : result
    // throw new ClientError({ ...errorResult, status: response.status }, { query, variables })
  }

  query(obj = {}) {
    return this.request(getGqlString(obj.query), obj.variables, obj)
  }

  mutate(obj) {
    return this.request(getGqlString(obj.mutation), obj.variables, obj)
  }

  setHeaders(headers) {
    this.options.headers = {
      ...this.options.headers,
      ...headers,
    }

    return this
  }

  setHeader(key, value) {
    const { headers } = this.options

    if (headers) {
      // TODO: what if headers is in nested array form... ?
      headers[key] = value
    } else {
      this.options.headers = { [key]: value }
    }
    return this
  }
}

export function request(url, query, variables) {
  const client = new GraphQLClient(url)

  return client.request(query, variables)
}

export default request

function getResult(response) {
  return response.text().then((res) => JSON.parse(res))
}
