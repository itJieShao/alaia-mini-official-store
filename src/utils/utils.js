import { get, isEmpty } from './utilityOperationHelper'
import { tabBarList } from '../constants/tabbar'

/**
 *随机数
 *
 * @param {*} val
 *
 */
export const randomString = (value) => {
  // value：随机数位数
  const len = Number(value)
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

/**
 *转换金额-千分位格式
 *
 * @param {*} val
 *
 */
// export const priceFormat = val => typeof val === 'number' && val === val;
export const priceFormat = (value) => {
  if (typeof value === 'string') value = parseFloat(value)
  if (isNaN(value)) return value
  return `${value.toFixed(0).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}`
}

/**
 *转换金额-千分位格式
 *
 * @param {*} val
 *
 */
// 带小数点
export const priceFormatWithDecimal = (val) => val && Number(val).toLocaleString();

/**
 * 判断是否为空
 *
 * @param {*} val
 */
// export const isEmpty = (val) => val == null || !(Object.keys(val) || val).length;
/**
 * 回到顶部
 *
 */
export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

export const openLiveChatWindow = () => {
  // const src =
  //   'https://v1.live800.com/live800/chatClient/chatbox.jsp?companyID=1282485&configID=47820&jid=1964805098&s=1'
  // window.location.href = src;
};

// 控制展开和收起智齿客服聊天页面
export function openLiveChat() {
  const miniProgram = sessionStorage.getItem('miniProgram');

  if (miniProgram) {
    // 小程序使用live800
    openLiveChatWindow();
  } else if (window.getzhiSDKInstance) {
    const zhiManager = (window.getzhiSDKInstance());
    zhiManager.expand();
  }
}

// 计算百分比 t吊牌价，s销售价
export function percent(listPrice, salePrice) {
  const t = parseInt(listPrice);
  const s = parseInt(salePrice);
  return t > s ? `${-Math.round(((t - s) / t) * 100)}%` : 0;
}

// 图片资源cdn：https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.4.2.713e3bc2T2qLbM
export function imgUrlReplace(url, w, h, resize = 'm_pad') {
  const _w = Number(w) * Math.ceil(uni.getSystemInfoSync().pixelRatio);
  const _h = Number(h) * Math.ceil(uni.getSystemInfoSync().pixelRatio);
  const symbol = url.indexOf('?') !== -1 ? '&' : '?';
  return `${url}${symbol}x-oss-process=image/resize,${resize},w_${_w},h_${_h}`;
}

export function trackEvent() {
  // third track api
  // _satellite && _satellite.track(type, params);
}

export function formatDateNew(time) {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();
  const date = [year, month, day].map(formatNum).join('-');
  time = [hour, minute, second].map(formatNum).join(':');
  return `${date} ${time}`;
}

const REG = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;

/**
 * 格式化时间
 * @param time
 */
const formatTime = (time) => {
  if (typeof time !== 'number' || time < 0) {
    return time;
  }
  const hour = parseInt(time / 3600, 10);
  time %= 3600;
  const minute = parseInt(time / 60, 10);
  time = parseInt(time % 60, 10);
  const second = time;

  return ([hour, minute, second]).map((n) => {
    n = n.toString();
    return n[1] ? n : `0${n}`;
  }).join(':');
};

/**
 * 格式化日期
 * @param time
 */
const formatNum = (value) => {
  const str = value.toString();
  return str[1] ? str : `0${str}`;
};
const formatDate = (time) => {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();

  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();
  const millisecond = time.getMilliseconds();

  const date = [year, month, day].map(formatNum).join('/');
  time = [hour, minute, second].map(formatNum).join(':');

  return `${date} ${time}.${millisecond}`;
};

/**
 * 格式链接
 * @param url
 * index/index => /pages/index/index
 * pages/index/index => /pages/index/index
 */
const normalizeUrl = (url) => {
  if (!url) {
    return url;
  }
  if (url[0] === '/') {
    url = url.substr(1);
  }
  if (!/^pages/.test(url)) {
    url = `pages/${url}`;
  }
  return `/${url}`;
};

/**
 * 解析链接
 * @param url
 * pages/index/index?id=1
 * =>
 * route: pages/index/index
 * query: {id: 1}
 */
const parseUrl = (url) => {
  const [route, search] = url.split('?');
  let query = {};
  if (search) {
    query = search.split('&').reduce((obj, pair) => {
      const [key, val] = pair.split('=');
      obj[key] = val;
      return obj;
    }, {});
  }
  return {
    route,
    query,
  };
};

/**
 * 去除首字符
 * @param str
 * @param char
 * /index/index => index/index
 */
const trimStart = (str, char) => {
  if (str[0] === char) {
    return trimStart(str.substr(1));
  }
  return str;
};

/**
 * 去除尾字符
 * @param str
 * @param char
 * /index/index/ => /index/index
 */
const trimEnd = (str, char) => {
  const { length } = str;
  if (str[length - 1] === char) {
    return trimEnd(str.substr(0, length - 1));
  }
  return str;
};

/**
 * 合并url
 * @param baseUrl
 * @param pathUrl
 * http://test.com/ /index/index
 * =>
 * http: //test.com/index/index
 */
const combinUrl = (baseUrl, pathUrl) => {
  if (~pathUrl.indexOf('://')) {
    return pathUrl;
  }
  // return `${trimEnd(baseUrl, '/')}/${trimStart(pathUrl, '/')}`;
  return `${baseUrl}${pathUrl}`;
};

/**
 * 清除抖动
 * @param {*} func
 * @param {*} wait
 * @param {*} immediate
 */
const debounce = (func, wait, immediate) => {
  /** 调用debounce声明一下变量 * */
  let timeout; let args; let context; let timestamp; let
    resullt;
  /** 初次由return函数调用, 后面自己递归调用 * */
  const later = function () {
    const now = new Date().getTime();
    // 记录在wait时间内上一次执行return函数的时间间隔
    const last = now - timestamp;
    // 时间间隔小于wait,继续递归调用
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 用于immediate==false在结束边界调用
      if (!immediate) {
        resullt = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function () {
    context = this;
    args = arguments;
    timestamp = new Date().getTime();
    const exec = immediate && !timeout;
    // 初次timeout不存在,设置延时调用later
    if (!timeout) timeout = setTimeout(later, wait);
    // 用于immediate==true在开始边界调用
    if (exec) {
      resullt = func.apply(context, args);
      context = args = null;
    }
    return resullt;
  };
};
/**
 * 防抖
 * @param   {function}  func        传入函数
 * @param   {number}    wait        表示时间窗口的间隔
 * @param   {object}    options     如果想忽略开始边界上的调用，传入{leading: false}。
 *                                  如果想忽略结尾边界上的调用，传入{trailing: false}
 * @returns {function}              返回客户调用函数   返回客户调用函数
 */
function throttle(func, wait, options) {
  let timeout; let context; let args; let
    result
  let previous = 0;
  options = options || {}
  // 延时执行函数
  const later = function () {
    const now = new Date().getTime()
    // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
    previous = options.leading === false ? 0 : now
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function () {
    context = this
    args = arguments
    const now = new Date().getTime()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
    // remaining大于时间窗口wait，表示客户端系统时间被调整过
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
      // 如果延迟执行不存在，且没有设定结尾边界不执行选项
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
/**
 *判断是否是Ipx
 */
const isIpx = () => {
  const { model } = uni.getSystemInfoSync();

  const ipxs = ['iPhone X', 'iPhone 11'];
  return ipxs.some((ipx) => model.indexOf(ipx) > -1)
};

/**
 * 生成随机ID
 */
const randomId = () => Math.random().toString(36).substr(2)

// 处理金额格式
const currency = (value) => {
  if (typeof value === 'string') value = parseFloat(value)
  if (isNaN(value)) return value
  return `￥${value.toFixed(0).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}`
}

/**
 * 判断手机系统
 */
const getPlatform = () => wx.getSystemInfoSync().platform

/**
 * 正则邮箱
 */
const isEmail = (value) => !checkEmoji(value) && /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value)

/**
 * 省市区数据处理
 */
const formatRegion = (n) => {
  const target = Object.keys(n).map((key) => {
    const temp = n[key];
    temp.key = key;
    return temp;
  });
  return target;
};

/**
 * 手机号码规则校验
 */
// const isPhone = (value) => !checkEmoji(value) && /^((\\+852)|(852))?([6|9])\d{7}$|^((\\+886)|(886))?[0][9]\d{8}$|^((\\+853)|(853))?[6]([8|6])\d{6}$|^((\\+86)|(86))?((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,2,3,5,6,7,8])|(18[0-9])|(19[0,1,2,5,6,7,8,9]))\d{8}$/.test(value) && value.length === 11;
const isPhone = (value) => !checkEmoji(value) && /^((\\+852)|(852))?([6|9])\d{7}$|^((\\+886)|(886))?[0][9]\d{8}$|^((\\+853)|(853))?[6]([8|6])\d{6}$|^((\\+86)|(86))?(1[3,4,5,6,7,8,9])\d{9}$/.test(value) && value.length === 11;

/**
 * 去除字符串首尾空格
 */
const spaceTrim = (value) => value.replace(/(^\s*)|(\s*$)/g, '')

/**
 * 中文校验
 */
const isChinese = (value) => /^[\u4E00-\uFA29\uE7C7-\uE7F3]+$/g.test(value)

/**
 * 英文校验
 */
const isEn = (value) => /^[a-zA-Z]+$/g.test(value)
/**
 * 正则文字
 */
const isText = (value) => {
  // 如果是表情返回true
  const regEmoji = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
  // 如果是数字返回false
  const regNumber = /[a-zA-Z]|[\u4e00-\u9fa5]|\s/;
  return !regEmoji.test(value) && regNumber.test(value)
  // return /^[[a-zA-Z\u4E00-\u9FA5]*$/.test(value)
}
/**
 *  纳税人识别号
 * */
const isInvoiceNumber = (str) => {
  if (str.length == 15 || str.length == 17 || str.length == 18 || str.length == 20) {
    return /^[0-9A-Za-z]+$/g.test(str)
  }
  return false
}

// 校验邮编
function checkPostal(str) {
  if (Object.prototype.toString.call(str) !== '[object String]') {
    return false
  }
  return /^[0-9]{6}$/.test(str);
}

// 校验特殊字符
function checkSpecialCharacter(str) {
  return isEmpty(str) || /[#￥%……&*{}【】]/im.test(str)
}

// 校验表情包
function checkEmoji(str) {
  return isEmpty(str) || /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g.test(str)
}

export const navigateTo = (url) => {
  if (!url) { return }
  url = /^\//.test(url) ? url : `/${url}`
  const res = tabBarList.find((item) => item.pagePath && url.includes(item.pagePath))
  if (res) {
    uni.switchTab({
      url,
    });
  } else {
    let isRedirect = false
    // 进入plp
    isRedirect = /(pages\/plp\/index)|(subPackages\/searchResult\/pages\/index)/g.test(url)
    isRedirect ? uni.redirectTo({
      url,
    }) : uni.navigateTo({
      url,
    })
  }
}

/**
 * rpx转换px
 * @param {*} rpx
 * @param {*} designWidth
 * @returns px
 */
export function rpxToPx(rpx = 0, designWidth = 750) {
  let deviceWidth = 375
  try {
    const { windowWidth = deviceWidth } = uni.getSystemInfoSync()
    deviceWidth = windowWidth
  } catch (error) {
    // catch uniapp
  }

  return rpx / designWidth * deviceWidth
}

export default {
  formatTime,
  formatNum,
  formatDate,
  normalizeUrl,
  parseUrl,
  trimStart,
  trimEnd,
  debounce,
  throttle,
  isIpx,
  combinUrl,
  randomId,
  currency,
  getPlatform,
  isEmail,
  formatRegion,
  isPhone,
  spaceTrim,
  isChinese,
  isEn,
  isText,
  isInvoiceNumber,
  checkPostal,
  navigateTo,
  checkSpecialCharacter,
  checkEmoji,
  rpxToPx,
}
