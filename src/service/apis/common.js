import apollo from '../apollo';
import fetch from '../apollo/fetch'
import { CURRENT_HOST, WECHAT_TRACK_URL } from '../../constants/env'
import {
  subscribeGql, menuGql, likeGoodsGql, helpListGql, helpDetailGql,
} from '../gqls'

export const subscribe = (payload) => apollo.mutate({
  mutation: subscribeGql,
  variables: {
    input: payload,
  },
});

export const menusList = () => apollo.query({
  query: menuGql,
})

export const queryGuessLikeGoods = (payload) => apollo.query({
  query: likeGoodsGql,
  variables: {
    ...payload,
  },
})

// 帮助中心列表
export const getHelpList = (payload) => apollo.query({
  query: helpListGql,
  variables: {
    ...payload,
  },
})

// 帮助中心详情
export const getHelpDetail = (payload) => apollo.query({
  query: helpDetailGql,
  variables: {
    ...payload,
  },
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
