import ga from '../assets/js/ga.js'
import {
  get,
} from './utilityOperationHelper'
import {
  getCategory,
  getSizeGA,
} from './product'
import store from '../store'
import {
  CURRENT_GA,
  CURRENT_HOST,
} from '../constants/env'
import packageFile from '../../package'
import {
  GA_EVENT_TYPE,
  GA_SCREEN_NAME,
} from '../constants/ga'
import {
  SHARE_PARAMS, SHARE_SIGN, SHARE_OBJ, QR_CODE_SIGN,
  PAGE_TYPE,
  QY_SHARE_SIGN,
} from '../constants/share'
import { OPEN_ID } from '../constants/user'

const {
  GoogleAnalytics,
  HitBuilders,
  Product,
  ProductAction,
  Promotion,
  CampaignParams,
} = ga;

export const GAGoogleAnalytics = GoogleAnalytics
export const GAHitBuilders = HitBuilders
export const GAProduct = Product
export const GAProductAction = ProductAction
export const GAPromotion = Promotion
export const GACampaignParams = CampaignParams

export const EVENT_TYPE = GA_EVENT_TYPE
export const SCREEN_NAME = GA_SCREEN_NAME
export const DL_VALUE = 'LaPrairie-WeChat-Mini-Program'
function productInfo({
  code,
  title,
  category,
  variant,
  price,
} = {}) {
  return new Product().setId(code)
    .setName(title)
    .setBrand('LaPrairie')
    .setCategory(category)
    .setVariant(variant)
    .setPrice(price)
}

function screenViewBuilder(screenName) {
  return commonConfig(new HitBuilders.ScreenViewBuilder().set('t', 'pageview'), screenName)
}

function eventBuilder(screenName) {
  return commonConfig(new HitBuilders.EventBuilder(), screenName)
}

function commonConfig(builder, screenName) {
  const [curentPage = {}] = getCurrentPages() || []

  // 首页不需要额外的参数，其它页面排除utm参数
  const keys = Object.keys(curentPage.options).filter((key) => !key.includes('utm_'))
  const urlParams = keys.map((key) => [key, curentPage.options[key]].join('=')).join('&')
  const url = curentPage.route === 'pages/index/index' || !urlParams ? curentPage.route
    : `${curentPage.route}?${urlParams}`

  return builder.set('dh', DL_VALUE).set('dt', screenName).set('dp', url)
    .set('z', new Date().getTime())
}

function getGAPromotionInfo(promotion, index) {
  const pageCode = store.getters['cms/pageCode']
  return new Promotion()
    .setId(index + 1)
    .setName(get(promotion, 'module'))
    .setCreative(`${pageCode}_${get(promotion, 'module')}`)
    .setPosition(pageCode)
}

/**
 * ga推送的前置操作
 * @param {*}} wrapped
 * @returns
 */
function trackerWrapper(wrapped) {
  return async function inner() {
    try {
      let openId = store ? store.getters['user/openId'] : uni.getStorageSync(OPEN_ID)
      if (!openId) {
        ({ openId } = await store.dispatch('user/loginByAuthCode'))
      }
      gaTracker.setClientId(openId)
    } catch (error) {
      console.log('获取openid失败', error)
    }
    const result = wrapped.apply(this, arguments);
    return result;
  }
}

// 设置基本信息
export const gaTracker = GoogleAnalytics.getInstance(getApp()).setAppName('线上精品店')
  .setAppVersion(packageFile.version).newTracker(CURRENT_GA)
  .setTrackerServer(CURRENT_HOST)
  // .setClientId(openId)

// 存粹的点击事件
export const trackerClick = ({
  category,
  action,
  label,
  screenName,
} = {}) => {
  const params = eventBuilder(screenName)
    .setCategory(category)
    .setAction(action)
    .setLabel(label) // 可选
    .setValue(1)
    .build()
  gaTracker.setScreenName(screenName).send(params)
}

// 添加到购物车
export const trackerAddCart = (productList) => {
  // 商品去重
  const productListMap = new Map();
  productList.forEach((product) => {
    productListMap.set(get(product, 'code'), product)
  });
  const productAction = new ProductAction(ProductAction.ACTION_ADD)
  const builder = eventBuilder(SCREEN_NAME.PRODUCT_DETAIL).setProductAction(productAction).setCategory(
    'WeChat-EC-ProductDetail',
  ).setAction('Click')
    .setLabel('Add to Cart');
  ([...productListMap.values()]).forEach((product) => {
    builder.addProduct(productInfo({
      code: get(product, 'code'),
      title: get(product, 'title'),
      category: getCategory(product),
      variant: getSizeGA(product),
      price: get(product, 'salePrice.amount'),
    }).setQuantity(1))
  });
  gaTracker.setScreenName(`${SCREEN_NAME.PRODUCT_DETAIL}——加入购物车按钮`).send(builder.build())
}

// 产品点击
export const trackerClickProduct = (product, {
  listName,
  screenName,
  event,
} = {}) => {
  const productAction = new ProductAction(ProductAction.ACTION_CLICK).setProductActionList(
    listName,
  )
  const builder = eventBuilder(screenName).setProductAction(productAction).setCategory(event
    .category).setAction(event.action);
  builder.addProduct(productInfo({
    code: get(product, 'code'),
    title: get(product, 'title'),
    category: getCategory(product),
    variant: getSizeGA(product),
    price: get(product, 'salePrice.amount'),
  }).setPosition(product.gaIndex))
  gaTracker.setScreenName(screenName).send(builder.build())
}

// 商品曝光
export const trackerProductImpression = trackerWrapper((productList, screenName) => {
  const builder = screenViewBuilder(screenName).setProductAction('view');
  (productList || []).forEach((product, index) => {
    builder.addImpression(productInfo({
      code: get(product, 'code'),
      title: get(product, 'title'),
      category: getCategory(product),
      variant: getSizeGA(product),
      price: get(product, 'salePrice.amount'),
    }).setPosition(index + 1), screenName)
  })
  gaTracker.setScreenName(screenName).send(builder.build())
})

// 商品详情查看
export const trackerProductPageView = trackerWrapper((product, screenName) => {
  const builder = screenViewBuilder(screenName).setProductAction(new ProductAction(ProductAction
    .ACTION_DETAIL));
  builder.addProduct(productInfo({
    code: get(product, 'code'),
    title: get(product, 'title'),
    category: getCategory(product),
    variant: getSizeGA(product),
    price: get(product, 'salePrice'),
  }))
  gaTracker.setScreenName(screenName).send(builder.build())
})

// 商品立即购买
export const trackerProdctBuyNow = (productList, screenName) => {
  const productAction = new ProductAction(ProductAction.ACTION_CHECKOUT).setCheckoutStep(1)
    .setCheckoutOptions('订单提交')
  const builder = eventBuilder(screenName).setProductAction(productAction).setCategory(
    'WeChat-EC-ProductDetail',
  ).setAction('Click')
    .setLabel('Checkout');
  (productList || []).forEach((product) => {
    builder.addProduct(productInfo({
      code: get(product, 'code'),
      title: get(product, 'title'),
      category: getCategory(product),
      variant: getSizeGA(product),
      price: get(product, 'salePrice.amount'),
    }).setQuantity(get(product, 'quantity') || 1))
  });
  gaTracker.setScreenName(screenName).send(builder.build())
}

// 购物车删除商品
export const trackerCartDelete = (product) => {
  const productAction = new ProductAction(ProductAction.ACTION_REMOVE)
  const builder = eventBuilder(SCREEN_NAME.CART).setProductAction(productAction).setCategory(
    'WeChat-EC-Cart',
  ).setAction('Click')
    .setLabel('Remove from Cart');
  builder.addProduct(productInfo({
    code: get(product, 'sku.code'),
    title: get(product, 'sku.product.title'),
    category: getCategory(get(product, 'sku.product')),
    variant: getSizeGA(get(product, 'sku')),
    price: get(product, 'sku.salePrice.amount'),
  }).setQuantity(get(product, 'quantity')))
  gaTracker.setScreenName(`${SCREEN_NAME.CART}——管理商品——商品删除按钮`).send(builder.build())
}

// 结算页面  页面浏览
export const trackerCheckoutPageView = (transportWay, productList) => {
  const productAction = new ProductAction(ProductAction.ACTION_CHECKOUT).setCheckoutStep(2)
    .setCheckoutOptions(transportWay || '顺丰快递')
  const builder = screenViewBuilder(SCREEN_NAME.CHECKOUT).setProductAction(productAction);
  (productList || []).forEach((product) => {
    builder.addProduct(productInfo({
      code: get(product, 'skuCode'),
      title: get(product, 'title'),
      category: getCategory(product),
      variant: getSizeGA(product),
      price: get(product, 'salePrice.amount'),
    }).setQuantity(get(product, 'quantity') || 1))
  });
  gaTracker.setScreenName(SCREEN_NAME.CHECKOUT).send(builder.build())
}

// 结算页面  点击
export const trackerCheckoutBuy = (orderId, productList) => {
  const productAction = new ProductAction(ProductAction.ACTION_CHECKOUT).setCheckoutStep(3)
    .setCheckoutOptions('微信支付').setTransactionId(orderId)
  const builder = eventBuilder(SCREEN_NAME.CHECKOUT).setProductAction(productAction);
  (productList || []).forEach((product) => {
    builder.addProduct(productInfo({
      code: get(product, 'skuCode'),
      title: get(product, 'title'),
      category: getCategory(product),
      variant: getSizeGA(product),
      price: get(product, 'salePrice.amount'),
    }).setQuantity(get(product, 'quantity') || 1))
  });
  gaTracker.setScreenName(`${SCREEN_NAME.CHECKOUT}——立即购买按钮`).send(builder.build())
}

// 支付成功
export const trackerPayPageView = (orderInfo = {}) => {
  const productAction = new ProductAction(ProductAction.ACTION_PURCHASE).setTransactionId(
    orderInfo.orderCode,
  )
    .setTransactionRevenue(get(orderInfo, 'amount.amount'))
    .setTransactionShipping(get(orderInfo, 'freight.amount'))
    .setTransactionCouponCode('')
  const builder = screenViewBuilder(SCREEN_NAME.PAY_RESULT_SUCCESS).setProductAction(
    productAction,
  );
  try {
    (get(orderInfo, 'orderLines') || []).forEach((line) => {
      const extInfos = JSON.parse(get(line, 'extInfos') || '{}')
      builder.addProduct(productInfo({
        code: get(line, 'skuCode'),
        title: get(line, 'name'),
        category: extInfos.category,
        variant: extInfos.size,
        price: get(line, 'amount.amount'),
      }).setQuantity(get(line, 'quantity')))
    });
  } catch (error) {
    console.log('解析失败', error)
  }
  gaTracker.setScreenName(SCREEN_NAME.PAY_RESULT_SUCCESS).send(builder.build())
}

// CMS 模块展示
export const trackerCMSModulesView = trackerWrapper((list, screenName) => {
  const builder = screenViewBuilder(screenName).setPromotionAction('view');
  (list || []).forEach((promotion, index) => {
    builder.addPromotion(getGAPromotionInfo(promotion, index));
  });
  gaTracker.setScreenName(`${screenName}促销展示`).send(builder.build())
})

// CMS 模块点击
export const trackerCMSClick = (promotion, {
  category,
  action,
  label,
  screenName,
} = {}) => {
  const builder = eventBuilder(screenName).setCategory(category)
    .setAction(action)
    .setLabel(label)
    .setPromotionAction('click');
  builder.addPromotion(getGAPromotionInfo(promotion, promotion.index));
  gaTracker.setScreenName(`${screenName}`).send(builder.build())
}

// 普通页面的页面浏览
export const trackerCommonPageView = trackerWrapper((screenName) => {
  const builder = screenViewBuilder(screenName);
  gaTracker.setScreenName(screenName).send(builder.build())
})

// 互动页面浏览
export const trackerInteractionPageView = trackerWrapper((screenName, params) => {
  const [currentPage = {}] = getCurrentPages()

  if (Object.keys(currentPage.options).length > 0) {
    const dl = `${DL_VALUE}${get(currentPage, '$page.fullPath')}`
    gaTracker.set('dl', dl)
  }

  const builder = screenViewBuilder(screenName)
    .set('dp', params.url)

  gaTracker.setScreenName(screenName).send(builder.build())
})

// 互动页面交互
export const trackerInteractionAction = (screenName, params) => {
  try {
    const builder = eventBuilder(screenName)
      .setCategory(params.category)
      .setAction(params.action)
      .setLabel(params.label)
      .set('dp', params.url)

    gaTracker.setScreenName(screenName).send(builder.build())
  } catch (error) {
    console.log(error, '埋点设置失败')
  }
}

const pdpShareReg = new RegExp(QR_CODE_SIGN)

/**
  params 页面的参数
 */
export const setTrackerParams = trackerWrapper((params) => {
  // 打开的页面参数
  const currentPage = getCurrentPages()
  const path = get(currentPage, '[0].route')
  const paramsStrList = []
  for (const i in params) {
    gaTracker.set(i, params[i])
    i && (paramsStrList.push(`${i}=${params[i]}`))
  }
  let dlStr = ''
  // 通过太阳码进入的pdp 需要单独处理
  if (pdpShareReg.test(params.scene) && path === 'subPackages/pdp/pages/pdp/index') {
    dlStr = `${DL_VALUE}/${path}?scene=${params.scene}&${SHARE_PARAMS}${PAGE_TYPE.PDP}`
    let shareObj = { ...SHARE_OBJ, ...{ utm_campaign: PAGE_TYPE.PDP } }
    // home delivery 单独处理
    if ((!wx.qy && store.getters['qy/baID'] && store.getters['qy/storeCode'])) {
      shareObj = {
        ...shareObj, utm: QY_SHARE_SIGN, utm_medium: QY_SHARE_SIGN, utm_source: 'qwechat',
      }
      dlStr = dlStr.replaceAll('wechat', 'qwechat').replaceAll(`${SHARE_SIGN}`, QY_SHARE_SIGN)
      dlStr += `&utm=${QY_SHARE_SIGN}`
    }
    for (const i in shareObj) {
      gaTracker.set(i, shareObj[i])
    }
    // 设置来源
    params.utm_medium = SHARE_SIGN
  } else if (paramsStrList.length > 0) {
    dlStr = `${DL_VALUE}${get(currentPage, '[0].$page.fullPath')}`
  }
  dlStr && (gaTracker.set('dl', dlStr))

  // 获取来源，AOP需要知道来源
  const source = params.utm_medium
  if (source) {
    store.dispatch('common/setAppletChannel', source)
  }
})
