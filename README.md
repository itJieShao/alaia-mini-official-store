# alaia微信小程序项目
# 目录

- [启动](#启动)
- [目录结构](#目录结构)
- [规范](#规范)
  - [api规范](#api规范)
  - [vuex规范](#vuex规范)
  - [页面规范](#页面规范)
  - [git提交规范](#git提交规范)
- [路由对应功能](#路由对应功能)
- [api接口链路](#api接口链路)
- [上线版本更新](#上线版本更新)
- [开发分支](#开发分支)

## 小程序商城开发规范

## 启动

### 设置宝尊 npm 域（设置过可忽略）

> npm config set @baozun:registry <http://registry-npmjs.baozun.com>

### 安装

> yarn

### 运行微信端商城

> yarn dev:mp-weixin

### 编译发布微信端商品

> yarn build:mp-weixin

### 查看微信端商城

> - 开发运行：dist/dev/mp-weixin
> - 正式发布目录：dist/build/mp-weixin

## 目录结构

```tree
├── utils                      与业务无关的工具类函数，例如router、http、debounce等
├── service
├── ├── apis                   接口
├── ├── gqls                   接口的查询语句
├── ├── fragments              graphql片段，2个接口以上的通用部分
│   └── apollo                 apollo client
├── pages                      主包目录
├── subpkgs
│   └── **/pages               各个子包目录
├── theme.scss                 全局样式
├──  constants       定义固定不变的常量
├── custom-tab-bar      小程序自定义底部菜单栏
├── components        组件目录
├── assets        静态资源存放
├── ├── fonts       字体
├── ├── images          图片
├── data           静态数据
├── styles           公共样式
```

[⬆️](#目录)

## 规范

### api规范

#### 接口模块

类似的功能放在一个文件内，文件名以 **主要作用对象** 为名  
写入到[根目录下的 apis](./example/mp-mall/apis/index.js)

> account 和 user: 用户相关信息
> cart: 购物车相关  
> cms: cms 系统配置相关  
> common: 公共  
> order: 订单相关  
> pdp: 商品详情页面相关

#### 接口命名

> 使用 graphiql 方式请求数据

- 接口查询语句
  - 事件名称 + Gql

```js
export const viewDataGql = gql`
  query getViewData($input: ViewDataQueryInput!) {
    shop {
      viewData(input: $input) {
        position
        type
        module
        value
      }
    }
  }
`
```

- 接口封装
  - 直接相关事件名称即可
  - 或者前面加上操作动词 （例如：获取商品详情 getProductDetail）
    - get 获取数据
    - delete 删除
    - update 更新

### vuex规范

> 可以先参考下官方写的[用例](https://github.com/vuejs/vuex/blob/dev/examples/shopping-cart/store/modules/cart.js)

#### store 模块

类似的功能放在一个文件内，文件名以 **主要作用对象** 为名  
写入到[根目录下的 store/modules](/src/store/index.js)

**`注意⚠️：只有所需的state属于多个组件（2个以上）共享时，才将其写入store里，如果严格属于内部组件或页面的那就写在内部即可`**

> cms: cms 配置相关  
> common: 公共  
> order: 订单相关  
> search: 商品搜索相关  
> shoppingCart: 购物车相关  
> user: 用户相关

### actions 和 mutations 命名规范

- **mutations**
  - 不对页面暴露，如需修改 store 中的 state 数据，只能通过`actions`方法来暴露
- **actions**
  - 一致对外，外界需要做的任何修改只能通过`actions`中的方法来修改

```js
import { getCartInfoData } from '../service/apis/cart'
import { get } from '../utils/utilityOperationHelper'

const state = {
  cartNumber: 0,
  selectCart: [],
}
const getters = {
  cartNumber: (state) => state.cartNumber,
}
const actions = {
  updateCartNumber({ commit }, num) {
    commit('updateCartNumber', num)
  },
  updateSelectCart({ commit }, data) {
    commit('updateSelectCart', data)
  },
  queryCartInfo({ commit }) {
    return getCartInfoData().then((res) => {
      const cartItems = get(res, 'data.customer.cart.cartItems') || []
      const selectCart = []
      let cartNum = 0
      cartItems.forEach((item) => {
        // 计算金额排除无效商品
        if (
          item.selected &&
          item.sku.product.onShelves &&
          item.sku.inventory > 0
        ) {
          cartNum += item.quantity
          selectCart.push(item)
        }
      })
      commit('updateCartNumber', cartNum)
      commit('updateSelectCart', selectCart)
      return cartItems
    })
  },
}
const mutations = {
  updateCartNumber(state, num) {
    state.cartNumber = num
  },
  updateSelectCart(state, data) {
    state.selectCart = data
  },
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
```

页面内使用

```js
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('shoppingCart', ['updateCartNumber']),
    // 一个页面内使用多个模块内的action
    ...mapActions('cart', ['addCartAsync']),

    onClick() {
      const cartItems = []
      const selectCart = []
      let cartNum = 0

      this.list.forEach((item) => {
        // 计算金额排除无效商品
        if (
          item.selected &&
          item.sku.product.onShelves &&
          item.sku.inventory > 0
        ) {
          cartItems.push({
            skuCode: item.sku.code,
            quantity: item.quantity,
          })
          selectCart.push(item)
          cartNum += item.quantity
        }
      })
      // 直接使用即可
      this.updateCartNumber(cartNum)
    },
  },
}
```

### 页面规范

- 所有的页面都需要做 iphonex 及以上的机型处理，即底部安全区域的处理

具体使用参考以下例子

```css
<!--
  以下只是例子，具体的则需要页面的结构来处理
  --
  > <!--
  在全局样式
  theme.scss
  文件中做了相关的安全区域的计算
  --
  > page {
  --safe-area-inset-bottom: 0rpx;
}

// 底部安全区域  env 和 constant 在桌面小程序会出现兼容问题，导致计算出错，所以这里进行判断一下
@supports (bottom: constant(safe-area-inset-bottom)) {
  page {
    --safe-area-inset-bottom: constant(safe-area-inset-bottom);
  }
}
@supports (bottom: env(safe-area-inset-bottom)) {
  page {
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
  }
}

// ---------------页面使用--------------
height: calc(
  100vh - 88rpx - 100rpx - var(--safe-area-inset-bottom) - var(--status-bar-height)
);

// ------ css 计算rpx方法 ------
页面css引用：@import "@/styles/utilities.scss";
css编写：rpx(1) = 2rpx

```

#### 自定义
**[Header]
> pages.json内配置style: navigationStyle
    {
      "path": "pages/index/index",
      "style": {
        "navigationStyle": "custom"
      }
    }
    <custom-nav-bar
      :title="'logo'"
      :left-icon="'search'"
      :left-text="'搜索'"
      :head-border="isHeadBorder"
      :head-blank="isHeadBlank"
      :head-font-color="false"
    />
    /******
    title: { type: String, default: 'logo' }, // 页面名
    fixed: { type: Boolean, default: true }, // fixed定位
    zIndex: { type: Number, default: 1001 }, // 层级
    leftIcon: { type: String, default: 'left' }, // 显示左返回按钮或其它按钮和事件
    leftText: String, // 左返回按钮文案
    leftArrow: { type: Boolean, default: true }, // 是否有左返回按钮或其它按钮
    headBorder: { type: Boolean, default: true }, // 是否header有下分割线
    headBlank: { type: Boolean, default: false }, // header是透明或白底
    headFontColor: { type: Boolean, default: false }, // 设置header字体颜色（黑白）
    ******/
> 使用自定义Header，需配置Header高度
- import navBarHeight from '@/components/common/navBarHeight';
    export default {
      mixins: [navBarHeight],
    }
- 最外层view设置padding-top值为 header高度
    <view class="xxx" :style="{ 'padding-top': computedHeight }">


**[tabBar]
- 使用方法：<custom-tab-bar />


#### git提交规范

- feat：新功能（feature）

- fix：修补 bug

- docs：文档（documentation）

- style： 格式（不影响代码运行的变动）

- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）

- test：增加测试

- chore：构建过程或辅助工具的变动

### 路由对应功能

两种情况：

- 在`index`， `plp`， `活动` 等灵活页面，可能会配置一级页面或者二级页面的路由，所以需要程序处理一下

  - 使用`utils/utils.js` 中的`navigateTo`方法跳转即可

- 其他固定页面，类似`商品详情`, `购物车`, `结算页面`, `个人中心`, `我的订单` 等等，通过 uni-app 给出的 API 进行相应的跳转即可
  - `uni.navigateTo(OBJECT)` 保留当前页面，跳转到应用的某个页面
  - `uni.redirectTo(OBJECT)` 关闭当前页面，跳转到应用内的某个页面
  - `uni.switchTab(OBJECT)` 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  - `uni.navigateBack(OBJECT)` 关闭当前页面，返回上一页面或多级页面
  - `uni.preloadPage(OBJECT)` 预加载页面，是一种性能优化技术
  - `uni.reLaunch(OBJECT)` 关闭所有页面，打开到应用内的某个页面

### api接口链路

1、 页面发起请求
2、store 中的 actions  
3、 api 函数

### 上线版本更新

- 每次上线之前需要更新 `package.json` 版本号（`version`）
  - 小功能更新 ： `0.0.1 -> 升级为 0.0.2`
  - 大版本更新 ：`0.0.1 -> 升级为 0.1.0`
- 升级之后需要<font color="red">单独</font>提交一下 `package.json` 文件
  - 提交格式为 `docs： version update 0.0.2`

### 开发分支

- master : 已经上线的或者测试通过即将上线的代码
- develop: 开发分支

# 有数对接:
- 通过npm安装SDK:  npm i sr-sdk-wxapp
- 在main.js 中通过 import 引入 SDK: import sr from 'sr-sdk-wxapp'
> 页面调用方法：this.$sr.track("custom_order", {})
    this.$sr.track("custom_order", {
        order: {
            order_id: "xx",
            order_time: "xx",
            order_status: "xx"
        },
        sub_orders: [
          {
            sub_order_id: "xx",
            order_amt: "xx",
            pay_amt: "xx"
          }
        ]
    });

    