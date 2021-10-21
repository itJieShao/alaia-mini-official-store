import apollo from '../apollo';
import fetch from '../apollo/fetch'
import { CURRENT_HOST, WECHAT_TRACK_URL } from '../../constants/env'
import { subscribeGql, menuGql } from '../gqls'

export const subscribe = (payload) => apollo.mutate({
  mutation: subscribeGql,
  variables: {
    input: payload,
  },
});

export const menusList = () => apollo.query({
  query: menuGql,
})

export const getAccessToken = () => new Promise((resolve, reject) => {
  uni.request({
    url: `${CURRENT_HOST}/wechat/miniProgram/accessToken`,
    method: 'GET',
    success: (res) => {
      resolve(res);
    },
  });
})

export const trackWechatAd = (data) => {
  // const queryString = `?access_token=${accessToken}&version=v1.0`
  return uni.request({
    url: WECHAT_TRACK_URL,
    method: 'POST',
    data,
  })
}
