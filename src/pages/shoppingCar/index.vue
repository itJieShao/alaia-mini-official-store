<template>
  <div class="container" :style="{ 'padding-top': computedHeight }">
    <!-- 头部 -->
      <custom-nav-bar title="购物袋" />
    <!-- 商品列表 -->
    <view class="content" >
      <view class="list" v-if="list.length > 0 && isMemberLogin">
        <view
          class="item-box"
          v-for="(item, index) in list"
          :key="get(item, 'sku.code')"
          :class="index === list.length - 1 ? 'last' : ''"
        >
          <productItem
            :productData="{...item, gaIndex: index + 1}"
            @deleteEventer="handleDeleteConfirm"
            @updateNum="cartUpdateNum"
            @changeSize="handleSizeChange"
            @cartStatusUpdate="cartStatusUpdate"
          />
        </view>
      </view>
      <view class="no-list" v-else-if="!cartLoading || !isMemberLogin">
        <view class="desc">
          <text class="icon-font icon-logo-alaia_000 logo"></text>
          <text class="empty">购物袋为空</text>
          <text class="tip-text">您可以将喜欢的商品加入购物袋</text>
        </view>
        <div class="go-button">
          <customButton :btnWidth="280" className="big-btn" @click="handleGoHome" >去逛逛</customButton>
        </div>
        <recently-like-products :config="GUESS_LIKE_CAET_CONFIG"/>
      </view>
    </view>

    <!-- 金额区域 -->
    <view :class="['footer', isIphX ? 'Xfooter' : '']" v-if="list.length > 0">
      <view class="item all-selected">
        <z-checkbox
          @checkEvent="handleSelectAll"
          :checked="allSelected"
        ></z-checkbox>
        <text>全选</text>
      </view>
      <view class="total">
        <view class="item">
          <text>合计: </text>
          <text>{{ totalPrice | currency }}</text>
        </view>
        <view class="item express-fee">
          <text>免运费</text>
        </view>
      </view>
      <view class="checkout">
        <customButton :btnWidth="280" className="big-btn" @click="checkoutEventer">立即结算({{cartNumber}})</customButton>
      </view>
    </view>
    <!-- 删除商品二次确认 -->
    <view class="message-box" v-if="messageVisible">
      <view class="message-inner">
        <view class="message-title">确定要删除此商品吗？</view>
        <view class="message-info">
           <view class="message-info-inner">
             <view class="arrow"></view>
             <view class="arrow"></view>
             <view class="arrow"></view>
           </view>
        </view>
        <view class="message-footer">
          <customButton
            class="cancel"
            :btnWidth="240"
            :btnHeight="70"
            className="big-btn"
            @click="messageVisible = false">
            暂不删除
          </customButton>
          <customButton
            :btnWidth="240"
            :btnHeight="70"
            className="transparent"
            @click="handleDelete"
            >
            确认删除
          </customButton>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import {
  mapActions, mapGetters, mapMutations,
} from 'vuex';
import RecentlyLikeProducts from '@/components/al-recentlyLikeProducts';
import navBarHeight from '@/components/common/navBarHeight';
import { addShopCartApi } from '@/service/apis/pdp';
import utils from '../../utils/utils';
import customButton from '../../components/al-button/normal.vue'
import productItem from './components/productItem/productItem';
import zCheckbox from '../../components/al-checkbox';
import { get } from '../../utils/utilityOperationHelper';
import {
  cartDelete,
  cartUpdateNum,
  cartSkuStatusUpdate,
} from '../../service/apis/cart';
import { GUESS_LIKE_CAET_CONFIG } from '@/constants/cms';
import { ORDER_INFO } from '../../constants/user'
import { BUY_MAX_NUM } from '../../constants/product'
import { LOACK_OF_INVENTORY } from '../../constants/errorCode'

export default {
  components: {
    productItem,
    zCheckbox,
    RecentlyLikeProducts,
    customButton,
  },
  mixins: [navBarHeight],
  data() {
    return {
      isIphX: utils.isIpx(),
      totalPrice: 0,
      list: [],
      loading: false,
      showPopup: false,
      cartLoading: true,
      messageVisible: false,
      currentDelProduct: null,
      // 导购信息
      guideInfo: null,
      isMemberLogin: true,
      GUESS_LIKE_CAET_CONFIG
    };
  },
  async onShow() {
    this.setTabSelected(2);
    const isMemberLogin = uni.getStorageSync('isMemberLogin') || false;
    const isAuthorizeInfo = uni.getStorageSync('isAuthorizeInfo') || false;
    this.isMemberLogin = !!(isMemberLogin && isAuthorizeInfo)
    if (this.isMemberLogin) {
      await this.getCartProductInfo()
    }
  },
  async onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  computed: {
    ...mapGetters('shoppingCart', ['cartNumber']),
    ...mapGetters('qy', ['isQY']),
    allSelected() {
      const filterList = this.filterProduct(this.list).filter((v) => v.sku.inventory > 0 && v.sku.product.onShelves)
      console.log('filterList---', filterList)
      return filterList.length > 0 ? filterList.every((v) => v.selected) : false
    }
  },
  methods: {
    get,
    ...mapActions('shoppingCart', ['updateCartNumber', 'updateSelectCart', 'queryCartInfo']),
    ...mapActions('order', ['getCartItem', 'clearActivities', 'setAddressInfo']),
    ...mapMutations('globle', ['setTabSelected']),
    async getCartProductInfo() {
      this.cartLoading = true
      try {
        // 获取购物车数据
        const cartItems = await this.queryCartInfo();
        this.list = cartItems
        console.log('cartItems>>>', cartItems)
        this.list = this.filterProduct(cartItems);
        if (cartItems.length > 0) {
          this.getCartAmount();
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.cartLoading = false
      }
    },
    // 过滤无效的商品
    filterProduct(dataArr) {
      if (Object.prototype.toString.call(dataArr) !== '[object Array]' || dataArr.length === 0) {
        return []
      }
      return dataArr.filter((item) => {
        const { product } = item.sku || {};
        return product && product.onShelves;
      })
    },
    // 获取购物车内商品金额
    async getCartAmount() {
      const cartItems = [];
      const selectCart = [];
      let cartNum = 0;

      this.list.forEach((item) => {
        item.id = Math.random()
        // 计算金额排除无效商品
        if (item.selected && item.sku.product.onShelves && item.sku.inventory > 0) {
          cartItems.push({
            skuCode: item.sku.code,
            quantity: item.quantity,
          })
          selectCart.push(item);
          cartNum += item.quantity;
        }
      });
      this.updateCartNumber(cartNum)
      this.updateSelectCart(selectCart)
      if (cartItems.length <= 0) {
        this.totalPrice = 0;
        this.clearActivities()
        return;
      }

      try {
        const data = await this.getCartItem({
          cartItems,
        })
        this.totalPrice = get(data, 'amount.amount');
        this.guideInfo = get(data, 'guideInfo')
      } catch (err) {
        console.log(err);
      }
    },
    // 删除购物车商品
    async deleteCart(skuCodes) {
      if (!skuCodes || skuCodes.length === 0) return
      let deleteProduct = []
      try {
        const data = await cartDelete(skuCodes);
        deleteProduct = this.list.filter((item) => get(item, 'sku.code') === skuCodes[0])
        // 删除购物车埋点
        this.addCartTrack('remove_from_cart', {
          skuCode: get(deleteProduct[0], 'sku.code'),
          spuCode: get(deleteProduct[0], 'sku.product.code'),
          skuName: get(deleteProduct[0], 'sku.product.title'),
          amount: get(deleteProduct[0], 'sku.product.salePrice.amount'),
          skuNum: get(deleteProduct[0], 'quantity'),
        })
        const errMessage = get(data, 'errors[0].message');
        if (!errMessage) {
          const cartItems = get(data, 'data.cartDelete.cart.cartItems');
          this.list = this.filterProduct(cartItems);
          if (cartItems.length > 0) {
            this.getCartProductInfo()
            // this.getCartAmount();
          } else {
            this.updateCartNumber(0)
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 更变商品数量
    async cartUpdateNum(params) {
      if (this.loading) {
        return
      }
      // 处理埋点数据
      const trackProductData = {
        ...params[0].trackProductData,
        skuNum: 1,
      }
      delete params[0].trackProductData
      this.loading = true;
      uni.showLoading({
        title: '加载中...',
      })
      try {
        const data = await cartUpdateNum(params);
        const errMessage = get(data, 'errors[0].message');
        const errCode = get(data, 'errors[0].code')
        if (!errMessage) {
          const cartItems = get(data, 'data.cartUpdate.cart.cartItems');
          this.list = this.filterProduct(cartItems);
          if (cartItems.length > 0) {
            await this.getCartAmount();
          }
        } else if (errCode === LOACK_OF_INVENTORY) {
          // 如果是库存不足的errorCode， 则给出提示
          uni.showToast({
            title: '商品库存不足',
            icon: 'none',
          })
          // 查询购物车信息
          this.getCartProductInfo()
        } else {
          uni.showToast({
            title: errMessage,
            icon: 'none',
          })
        }
        // 进行调用埋点接口
        const actionType = params[0].quantity > 1 ? 'append_to_cart' : 'remove_from_cart'
        this.addCartTrack(actionType, trackProductData)
      } catch (err) {
        console.log(err);
      } finally {
        uni.hideLoading()
      }
      this.loading = false;
    },
    // 修改购物车状态
    async cartStatusUpdate(params) {
      if (this.loading) {
        return
      }
      this.loading = true;
      uni.showLoading({
        title: '加载中...',
      })
      try {
        const data = await cartSkuStatusUpdate(params);
        const errMessage = get(data, 'errors[0].message');
        if (!errMessage) {
          const cartItems = get(data, 'data.cartSkuStatusUpdate.cart.cartItems');
          this.list = this.filterProduct(cartItems);
          if (cartItems.length > 0) {
            this.getCartAmount();
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        uni.hideLoading()
        this.loading = false;
      }
    },
    // 提交购物车
    async checkoutEventer() {
      const valiableProductList = this.list.filter((item) => (
        item.selected && item.sku.inventory > 0 && item.sku.product.onShelves
      ))
      if (this.cartNumber <= 0 || (!valiableProductList || valiableProductList.length === 0)) {
        uni.showToast({
          title: '请选择购买商品',
          icon: 'none',
        });
        return
      }
      const orderLines = valiableProductList.map(((item, index) => ({
        sort: index + 1,
        spuCode: get(item, 'sku.product.code'),
        skuCode: get(item, 'sku.code'),
        quantity: get(item, 'quantity'),
      })))
      const orderInfo = { orderLines }
      // 不是企业微信小程序，并且有导购的信息
      if (!this.isQY && this.guideInfo && this.guideInfo.guideId) {
        orderInfo.guideInput = this.guideInfo
      }
      uni.setStorageSync(ORDER_INFO, orderInfo)
      // 检查单个商品的数量是否超过了2个
      const isBeyond = orderLines.find((item) => item.quantity > BUY_MAX_NUM)
      if (isBeyond) {
        // this.showPopup = true
        uni.showToast({
          title: '对不起，您的购物数量已超出限制！',
          icon: 'none',
        })
      } else {
        this.setAddressInfo(null)
        uni.navigateTo({
          url: '/subPackages/checkout/pages/index?fromCart=true',
        })
      }
    },
    // 购物车埋点接口
    async addCartTrack(actionType, productData) {
      const {
        skuCode, skuName, spuCode, spuName, amount, skuNum,
      } = productData
      const trackData = {
        sku: {
          sku_id: skuCode || spuCode,
          sku_name: skuName || spuName,
        },
        spu: {
          spu_id: spuCode || skuCode, // 若商品无spu_id时，可传sku_id信息
          spu_name: spuName || skuName, // 若商品无spu_name时，可传sku_name信息
        },
        sale: {
          original_price: amount || 0,
          current_price: amount || 0,
        },
        sku_num: skuNum || 1,
      }
      this.$sr.track('add_to_cart', {
        action_type: actionType,
        ...trackData,
      });
    },
    // 全选所有购物车商品
    handleSelectAll({ checked }) {
      const allSkuCode = this.filterProduct(this.list).map((v) => v.lineId)
      this.cartStatusUpdate({
        selected: checked,
        lineIds: allSkuCode,
      })
    },
    handleDeleteConfirm(skuCodes) {
      this.currentDelSkuCodes = skuCodes
      this.messageVisible = true
    },
    handleDelete() {
      this.deleteCart(this.currentDelSkuCodes);
      this.messageVisible = false
    },
    // 切换sku尺码,先添加要添加的sku,再删除之前的sku
    async handleSizeChange(e) {
      uni.showLoading({
        title: '加载中...',
      })
      try {
        const res = await addShopCartApi({
          skuCode: e.addSku,
          quantity: e.quantity,
        });
        const errMessage = get(res, 'errors[0].message');
        if (errMessage) {
          uni.hideLoading()
          this.list = []
          this.getCartProductInfo()
          const messages = errMessage.indexOf('库存') != -1
            ? '库存不足'
            : '超过最大购买数量';
          setTimeout(() => {
            uni.showToast({
              title: messages,
              icon: 'none',
              duration: 2500,
            });
          }, 250);
        } else {
          uni.hideLoading()
          await this.deleteCart([e.delSku])
        }
        // 调用埋点
        this.addCartTrack('append_to_cart', {
          ...e.trackProductData,
          skuCode: e.addSku,
          skuNum: e.quantity,
        })
      } catch (error) {
        uni.hideLoading()
        console.error(error);
      }
    },
    handleGoHome() {
      this.setTabSelected(0);
      uni.switchTab({
        url: '/pages/index/index',
      });
    },
    handleCheckout() {
      uni.navigateTo({
        url: '/subPackages/checkout/pages/index',
      })
    },
  },
  filters: {
    currency(value) {
      if (!value && value !== 0) return '0';
      return utils.currency(value);
    },
  },

};
</script>

<style lang="scss" scoped>
  @import "./index";
</style>
