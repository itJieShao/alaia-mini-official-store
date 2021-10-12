import { GraphQLClient } from './client'
import { AUTH_TOKEN } from '../../constants/user'
import { CURRENT_API } from '../../constants/env'

const defaultHeaders = {
  credentials: 'include',
  mode: 'cors',
  authorization: uni.getStorageSync(AUTH_TOKEN),
}
// console.log( uni.getStorageSync(AUTH_TOKEN),'221112')
// 创建 graphql 客户端
const apolloClient = new GraphQLClient(CURRENT_API, defaultHeaders)

export default apolloClient
