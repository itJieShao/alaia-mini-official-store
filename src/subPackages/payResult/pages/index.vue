<template>
  <view class="pay-result-container">
    <!-- 自定义页头 -->
    <custom-nav-bar :title="'支付结果'" />
    <view class="container" :style="{ 'padding-top': computedHeight }">
      <!-- 支付成功的文案 -->
      <view class="result-info" v-if="isSuccess">
        <view class="result-icon">
          <image src="https://res-tasaki.baozun.com/static/images/success-icon%402x.png" alt="">
        </view>
        <view class="result-msg">支付成功，感谢您的订购</view>
        <view class="result-tips">我们将尽快发货，当您收到作品时，请当面验收快递包裹后再签收。</view>
      </view>
      <!-- 支付失败的文案 -->
      <view class="result-info" v-else>
        <view class="result-msg">支付失败，重新支付</view>
        <view class="result-tips">
          请尽快完成支付，15分钟后订单将会被取消，如遇支付问题，请洽询
          <button
            class="service-btn"
            open-type="contact"
            @click="handleContact"
            @contact="bindContact"
          >
            <text class="text">在线客服</text>
          </button>
        </view>
      </view>
      <!-- 订单号&金额&时间 信息 -->
      <view class="order-brief">
        <view class="brief-item">
          <text class="label">订单编号：</text>
          <text class="value">{{orderInfo.orderCode}}</text>
        </view>
        <view class="brief-item">
          <text class="label">下单时间：</text>
          <text class="value">{{orderTime}}</text>
        </view>
        <view class="brief-item brief-item-last">
          <text class="label">订单金额：</text>
          <text class="value">{{get(orderInfo, 'amount.amount') | currency}}</text>
        </view>
      </view>

      <!-- 配送信息 -->
      <view class="distribution">
        <view class="title">配送信息 </view>
        <view class="distribution-info">
          <view class="d-item">
            <text>{{get(orderInfo, 'receiptInfo.name')}}</text>
            <text>{{get(orderInfo, 'receiptInfo.mobile')}}</text>
          </view>
          <view class="d-item detail">
            {{addressDetail}}
          </view>
        </view>
      </view>
      <!-- 订单摘要 -->
      <view class="order-summary-info">
        <view class="title">订单摘要 <text class="num">(共{{ totalQuantity }}件)</text></view>
        <view class="order-product-list">
          <view
            v-for="(product, index) in productList"
            :key="product.code"
            :class="productList.length === index + 1 ? 'last-product' : ''"
          >
            <OrderProductItem
              isLink
              :product="{ ...product, gaIndex: index + 1 }"
            />
          </view>
        </view>
      </view>
      <!-- 订单金额汇总 -->
      <OrderAmountInfo :orderAmount="get(orderInfo, 'amount.amount')" />
      <!-- 处理按钮 -->
      <view class="fixed-button-wrap">
        <view class="button-container">
          <customButton :btnWidth="690" className="big-btn" v-if="isSuccess" @click="handleGoBackHome">去逛逛</customButton>
          <customButton :btnWidth="690" className="big-btn" v-else @click="handleOrderPay">立即支付</customButton>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import OrderProductItem from '@/components/al-orderProductItem';
import OrderAmountInfo from '@/components/al-orderAmountInfo';
import customButton from '@/components/al-button/normal';
import navBarHeight from '@/components/common/navBarHeight';
import { get } from '@/utils/utilityOperationHelper';
import utils from '@/utils/utils';

export default {
  components: { OrderProductItem, OrderAmountInfo, customButton },
  name: 'PayResult',
  mixins: [navBarHeight],
  data() {
    return {
      orderId: '',
      isRePay: false,
      isSuccess: true,
      orderInfo: {},
    };
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  onLoad({ orderId, isRePay, isSuccess }) {
    this.orderId = orderId;
    this.isRePay = isRePay;
    this.isSuccess = isSuccess === 'yes';
  },
  onShow() {
    if (this.orderId) {
      this.getOrderDetail(this.orderId).then((res) => {
        this.orderInfo = res;
        if (this.isSuccess) {
          const orderNo = res.orderCode
          const amount = get(res, 'amount.amount')
          const orderTime = new Date(get(res, 'orderTime').replace(/\-/g, '/')).getTime()
          const trackData = {
            order: {
              order_id: orderNo,
              order_time: orderTime,
            },
            sub_orders: [{
              sub_order_id: orderNo,
              order_amt: amount,
              pay_amt: amount,
            }],
          }
          this.srTrackOrder('payed', trackData)
        }
      });
    }
  },
  methods: {
    get,
    ...mapActions('order', ['getOrderDetail', 'orderPay']),
    ...mapMutations('globle', ['setTabSelected']),
    handleOrderPay() {
      const orderNo = this.orderInfo.orderCode
      const amount = get(this.orderInfo, 'amount.amount')
      const orderTime = new Date(get(this.orderInfo, 'orderTime').replace(/\-/g, '/')).getTime()
      const trackData = {
        order: {
          order_id: orderNo,
          order_time: orderTime,
        },
        sub_orders: [{
          sub_order_id: orderNo,
          order_amt: amount,
          pay_amt: amount,
        }],
      }
      this.srTrackOrder('pay', trackData)
      this.orderPay({ orderNo }).then(() => {
        uni.redirectTo({
          url: `/subPackages/payResult/pages/index?orderId=${orderNo}&isSuccess=yes`,
        })
        this.isSuccess = true
      }).catch((error) => {
        this.srTrackOrder('cancel_pay', trackData)
        uni.showToast({
          title: error.message,
          icon: 'none',
        })
        console.log(error)
        // Do nothing
      })
    },
    handleGoBackHome() {
      this.setTabSelected(0);
      uni.switchTab({
        url: '/pages/index/index',
      });
    },
    srTrackOrder(orderStatus, params) {
      params.order.order_status = orderStatus
      this.$sr.track('custom_order', params)
    },
    handleContact() {},
    bindContact() {},
  },
  computed: {
    totalQuantity() {
      return this.productList.reduce((total, v) => total + v.quantity, 0);
    },
    addressDetail() {
      const {
        province,
        city,
        district,
        address,
      } = get(
        this.orderInfo,
        'receiptInfo',
        {},
      );
      return `${province || ''} ${city || ''} ${district || ''} ${address || ''}`;
    },
    productList() {
      return (this.orderInfo.orderLines || []).map((order) => {
        let extObj
        try {
          extObj = JSON.parse(order.extInfos)
        } catch (error) {
          extObj = {}
        }
        const { size, material, style } = extObj
        return {
          ...order,
          size,
          material,
          style,
        }
      })
    },
    orderTime() {
      const { orderTime = '' } = this.orderInfo
      const idx = orderTime.indexOf('+') - 1
      return orderTime.substring(0, idx)
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
  @import './index';
</style>
