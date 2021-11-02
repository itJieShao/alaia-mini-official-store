import gql from 'graphql-tag';
import { get } from '../../utils/utilityOperationHelper';
import {
  AUTH_TOKEN,
  INVALID_TOKEN_CODE_ARRAY,
  ANONYMOUS_AUTH_TOKEN,
  IS_MEMBER_LOGIN,
} from '../../constants/user';
import store from '../../store'
import log from '../../utils/log'

const requestList = [];
let requesting = false;

function getUserErrors(obj) {
  return keysIterator(obj);
}

function keysIterator(obj, targetKey = 'errors') {
  for (const key in obj) {
    if (obj[targetKey]) {
      return obj[targetKey];
    }
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        return keysIterator(obj[key], targetKey);
      }
    }
  }
  return ''
}

async function reFetch() {
  requesting = true;
  try {
    await store.dispatch('user/loginByAuthCode')
    for (let i = 0, item; i < requestList.length; i++) {
      item = requestList[i];
      item.resolve(item.request());
    }
  } catch (err) {
    const message = get(err, 'errors[0].message');
    uni.showToast({
      title: message || '请求出错，请稍后再试',
      icon: 'none',
    });
  }
  requesting = false;
}

function isNeedReLogin(userErrors) {
  const code = get(userErrors, '0.code');

  return INVALID_TOKEN_CODE_ARRAY.indexOf(code) > -1;
}

function showErrorMessage(data) {
  try {
    const obj = JSON.parse(data);
    const msg = get(obj, 'errors[0].message')
    if (msg) {
      uni.showToast({
        title: msg,
        icon: 'none',
      });
    }
  } catch (err) {
    console.log(err)
  }
}

function request(url, init, requestParams = {}) {
  return new Promise((resolve) => {
    const option = init || {};
    const operationName = requestParams.operationName || getOperationNameByBody(option.body)
    uni.request({
      url: `${url}/${operationName}`,
      header: {
        'UNEX-USER-TOKEN': getToken(operationName),
        // 'x-gray': 'no',
        // lang: 'en_US',
        ...option.headers,
        authorization: getToken(operationName),
      },
      method: option.method,
      data: option.body,
      dataType: 'text',
      success: (res) => {
        const { data, statusCode, errMsg } = res;
        let parsedData;
        try {
          parsedData = JSON.parse(data);
          console.info('[✅success]', parsedData);
        } catch (e) {
          log.error(`接口数据解析失败-----${operationName}`, operationName, data)
          console.info('[✅success string]', data);
        }
        const userErrors = getUserErrors(parsedData);
        console.log('errors ', userErrors);
        // 登陆过期合并购物车时匿名token失效，就不用去做自动登陆了
        if (
          isNeedReLogin(userErrors)
          && (get(init, 'body') || '').indexOf('cartMerge') === -1
        ) {
          requestList.push({
            resolve,
            request: () => request(url, init),
          });
          if (!requesting) {
            reFetch();
          }
        } else {
          if (!requestParams.hideErrorMsg) {
            showErrorMessage(data);
          }
          resolve({
            ok: () => statusCode >= 200 && statusCode < 300,
            statusText: () => errMsg,
            text: () => Promise.resolve(data),
          });
        }
      },
      fail: (error) => {
        console.info('[❌error]-[apollo]', error);
        if (!requestParams.hideErrorMsg) {
          showErrorMessage(error);
        }
        resolve({
          ok: false,
          statusText: () => error,
          text: () => Promise.resolve(error),
        });
      },
    });
  });
}

function getOperationNameByBody(body) {
  try {
    if (!body) return ''
    const formatBody = JSON.parse(body)
    const res = gql(formatBody.query || formatBody.mutation)
    return get(res, 'definitions[0].name.value')
  } catch (error) {
    return ''
  }
}

function getToken(operationName) {
  // 后台登录接口不能带上token
  if (operationName === 'autoLoginWechat') {
    return '';
  }
  return uni.getStorageSync(AUTH_TOKEN)
}

export default request;
