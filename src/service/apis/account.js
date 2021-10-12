import { get } from '../../utils/utilityOperationHelper';
import apolloClient from '../apollo';
import {
  syncCrmMemberInfoGql, queryCustomerGql, decryptDataGql,
  sendSmsVerifyCodeGql,
  bindMobileByVerifyCodeGql,
  bindMobileByEncryptedDataGql,
  updateAccountInfoGql,
  editAccountInfoGql,
} from '../gqls'

// 解密数据
export const decryptData = (input) => apolloClient.mutate({
  mutation: decryptDataGql,
  variables: input,
})

// 发送验证码,返回布尔值
export const sendSmsVerifyCode = (params) => apolloClient.mutate({
  mutation: sendSmsVerifyCodeGql,
  fetchPolicy: 'no-cache',
  variables: params,
})

// 绑定手机号,返回布尔值
export const bindMobileByVerifyCode = (params) => apolloClient.mutate({
  mutation: bindMobileByVerifyCodeGql,
  fetchPolicy: 'no-cache',
  variables: params,
  hideErrorMsg: true,
})

// 绑定手机号,根据微信加密数据
export const bindMobileByEncryptedData = (params) => apolloClient.mutate({
  mutation: bindMobileByEncryptedDataGql,
  fetchPolicy: 'no-cache',
  variables: params,
  hideErrorMsg: true,
})

// 查询用户信息
export const queryCustomer = () => apolloClient.query({
  query: queryCustomerGql,
  fetchPolicy: 'no-cache',
})

// 编辑用户信息,返回布尔值
export const updateAccountInfo = (params) => apolloClient.mutate({
  mutation: updateAccountInfoGql,
  fetchPolicy: 'no-cache',
  variables: params,
})

// 编辑用户信息
export const editAccountInfo = (params) => apolloClient.mutate({
  mutation: editAccountInfoGql,
  fetchPolicy: 'no-cache',
  variables: params,
})

// 同步crm会员信息到unex
export const syncCrmMemberInfo = () => apolloClient.mutate({
  mutation: syncCrmMemberInfoGql,
  fetchPolicy: 'no-cache',
})
