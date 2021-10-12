const REGULAR_CLICK = {
  page1: {
    category: 'WeChat-EC-常规互动 Campaign Page 1',
    action: 'Click',
    label: '长按开启赋新经典',
    url: 'pages/campaign/常规互动page1',
  },
  video1: {
    category: 'WeChat-EC-常规互动 Campaign Vedio 1',
    action: 'Click',
    label: '跳过',
    url: 'pages/campaign/常规互动page1',
  },
  page2: {
    category: 'WeChat-EC-常规互动 Campaign Page 2',
    action: 'Click',
    label: '向上滑动',
    url: 'pages/campaign/常规互动page2',
  },
  video2: {
    category: 'WeChat-EC-常规互动 Campaign Vedio 2',
    action: 'Click',
    label: '跳过',
    url: 'pages/campaign/常规互动page2',
  },
  page3: {
    category: 'WeChat-EC-常规互动 Campaign Page 3',
    action: 'Click',
    label: '提升',
    url: 'pages/campaign/常规互动page3',
  },
  video3: {
    category: 'WeChat-EC-常规互动 Campaign Vedio 3',
    action: 'Click',
    label: '跳过',
    url: 'pages/campaign/常规互动page3',
  },
  page4: {
    category: 'WeChat-EC-常规互动 Campaign Page 4',
    action: 'Click',
    label: '奢护预约',
    url: 'pages/campaign/常规互动page4',
  },
}

const PATH_WAY_CLICK = {
  page1: {
    category: 'WeChat-EC-520轨道互动 Campaign Page 1',
    action: 'Click',
    label: '向下滑动',
    url: 'pages/campaign/520轨道互动page1',
  },
  video1: {
    category: 'WeChat-EC-520轨道互动 Campaign Video 1',
    action: 'Click',
    label: '跳过',
    url: 'pages/campaign/520轨道互动page1',
  },
  page2: {
    category: 'WeChat-EC-520轨道互动 Campaign Page 2',
    action: 'Click',
    label: '轻晃手机交互A',
    url: 'pages/campaign/520轨道互动page2',
  },
  video2: {
    category: 'WeChat-EC-520轨道互动 Campaign Video 2',
    action: 'Click',
    label: '跳过',
    url: 'pages/campaign/520轨道互动page2',
  },
  page3: {
    category: 'WeChat-EC-520轨道互动 Campaign Page 3',
    action: 'Click',
    label: '轻晃手机交互B',
    url: 'pages/campaign/520轨道互动page3',
  },
  video3: {
    category: 'WeChat-EC-520轨道互动 Campaign Video 3',
    action: 'Click',
    label: '跳过',
    url: 'pages/campaign/520轨道互动page3',
  },
  page4: {
    category: 'WeChat-EC-520轨道互动 Campaign Page 4',
    action: 'Click',
    label: '轻晃手机交互C',
    url: 'pages/campaign/520轨道互动page4',
  },
  video4: {
    category: 'WeChat-EC-520轨道互动 Campaign Video 4',
    action: 'Click',
    label: '跳过',
    url: 'pages/campaign/520轨道互动page4',
  },
  page5: {
    category: 'WeChat-EC-520轨道互动 Campaign Page 5',
    action: 'Click',
    label: '轻晃手机交互D',
    url: 'pages/campaign/520轨道互动page5',
  },
  page6: {
    category: 'WeChat-EC-520轨道互动 Campaign Page 6',
    action: 'Click',
    label: '向下滑动',
    url: 'pages/campaign/520轨道互动page6',
  },
  page7: {
    category: 'WeChat-EC-520轨道互动 Campaign Page 7',
    action: 'Click',
    label: '奢护预约',
    url: 'pages/campaign/520轨道互动page7',
  },
}

// 520轨道互动

export const GA_EVENT_TYPE = {
  // 底部导航栏任意菜单
  NAV_BAR: {
    category: 'WeChat-EC-Navigation',
    action: 'Click',
  },
  // 精选产品系列菜单
  MENU: {
    category: 'WeChat-EC-Navigation',
    action: 'Click',
  },
  // 首页 按钮
  INDEX_BTN: {
    category: 'WeChat-EC-HomePage',
    action: 'Click',
  },
  // 首页商品点击
  INDEX_PRODUCT: {
    category: 'WeChat-EC-HomePage',
    action: 'Product Click',
  },
  // 首页商品曝光
  INDEX_VIEW: {
    category: 'WeChat-EC-HomePage',
    action: 'Product Impression',
  },
  // 商品列表页面 按钮点击
  PLP_BTN: {
    category: 'WeChat-EC-ProductList',
    action: 'Click',
  },
  // 商品列表 点击商品
  PLP_PRODUCT: {
    category: 'WeChat-EC-ProductList',
    action: 'Product Click',
  },
  // 商品列表，商品展示
  PLP_PRODUCT_VIEW: {
    category: 'WeChat-EC-ProductList',
    action: 'Product Impression',
  },
  // 商品详情页面, 加入购物车
  PRODUCT_DETAIL_ADD_CART: {
    category: 'WeChat-EC-ProductDetail',
    action: 'Click',
    label: 'Add to Cart',
  },
  // 商品详情页面, 立即结算
  PRODUCT_DETAIL_BUY_NOW: {
    category: 'WeChat-EC-ProductDetail',
    action: 'Click',
    label: 'Checkout',
  },
  // 商品详情 点击客服服务
  PRODUCT_DETAIL_CUSTOMER_SERVICE: {
    category: 'WeChat-EC-ProductDetail',
    action: 'Click',
    label: 'Customer service',
  },
  // 商品详情 点击推荐的商品
  PRODUCT_DETAIL_RPODUCT_CLICK: {
    category: 'WeChat-EC-ProductDetail',
    action: 'Product Click',
  },
  // 商品详情， 加载推荐商品
  PRODUCT_DETAIL_RECOMMEND_RPODUCT_VIEW: {
    category: 'WeChat-EC-ProductDetail',
    action: 'Product Impression',
  },
  // 商品详情, 立即预约奢护体验
  PRODUCY_DETAIL_APPOINT: {
    category: 'WeChat-EC-ProductDetail',
    action: 'Click',
  },
  PRODUCT_DETAIL_SHARE: {
    category: 'WeChat-EC-ProductDetail',
    action: 'Click',
    label: 'Share',
  },
  // 购物车页面 点击“删除”按钮
  CART_DELETE: {
    category: 'WeChat-EC-Cart',
    action: 'Click',
    label: 'Remove from Cart',
  },
  // 购物车页面 点击“结算”按钮
  CART_CHECKOUT: {
    category: 'WeChat-EC-Cart',
    action: 'Click',
    label: 'Checkout',
  },
  // 购物车页面 点击商品
  CART_PRODUCT_CLICK: {
    category: 'WeChat-EC-Cart',
    action: 'Product Click',
  },
  // 确认订单页(尚未确认） 点击立即支付按钮
  CHECKOUT_PAY_CLICK: {
    category: 'WeChat-EC-OrderConfirmation',
    action: 'Click',
    label: 'Pay now',
  },
  // 个人中心 我的账户 各种选择或者按钮点击
  ACCOUNT_CLICK: {
    category: 'WeChat-EC-MyAccount',
    action: 'Click',
  },
  ODER_PRODUCT_CLICK: {
    category: 'WeChat-EC-OrderList',
    action: 'Product Click',
  },
  // 支付成功页 点击“返回首页”按钮
  PAY_SUCCESS_BACK_INDEX_CLICK: {
    category: 'WeChat-EC-PaySuccess',
    action: 'pay success',
  },
  // 支付成功页 点击“查看订单”按钮
  PAY_SUCCESS_VIEW_ORDERS_CLICK: {
    category: 'WeChat-EC-PaySuccess',
    action: 'Click',
    label: 'order details',
  },
  // 支付失败页 点击“重新支付”按钮
  PAY_FAILED_RE_PAY_CLICK: {
    category: 'WeChat-EC-PayFail',
    action: 'pay again',
    label: '微信支付',
  },
  // 支付失败页 点击“查看订单”按钮
  PAY_FAILED_VIEW_ORDERS_CLICK: {
    category: 'WeChat-EC-PayFail',
    action: 'Click',
    label: 'order details',
  },
  // 用户注册
  REGISTER_USER_EVENT: {
    category: 'WeChat-EC-Registration',
    action: 'Status',
    label: 'Registration Success',
  },
  // 常规互动
  REGULAR_CLICK,
  PATH_WAY_CLICK,
}

export const GA_SCREEN_NAME = {
  PLP: '商品展示列表页面',
  ACTIVITY_PLP: '活动页面',
  INDEX: '首页',
  PRODUCT_DETAIL: '商品详情页面',
  CART: '购物车页面',
  CHECKOUT: '结算页面',
  ACCOUNT: '个人中心',
  ORDER: '订单列表页面',
  PAY_RESULT_SUCCESS: '支付成功页',
  PAY_RESULT_FAILED: '支付失败页',
  SEARCH: '搜索结果页',
  SEARCH_MENU: '左侧菜单栏',
  CORLOR: '理想色号页面',
  INVOICE: '电子发票页面',
  EDIT_ACCOUNT: '编辑个人信息页面',
  RULES: '隐私政策页面',
  VIEW_ACCOUNT: '个人信息查看页面',
  REGISTER: '会员注册页面',
  REGULAR: '常规互动',
  PATH_WAY: '520轨道互动',
  AOP: 'AOP奢护预约',
}
