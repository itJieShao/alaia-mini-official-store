<template>
  <view class="pay-result-container">
    <!-- 自定义页头 -->
    <custom-nav-bar :head-font-color="false" />
    <view class="container" :style="{ 'padding-top': computedHeight }">
      <!-- 支付成功的文案 -->
      <view class="form-item-block result-info" v-if="isSuccess">
        <view class="result-icon">
          <image src="https://res-tasaki.baozun.com/static/images/success-icon%402x.png" alt="">
        </view>
        <view class="result-msg">支付成功，感谢您的订购</view>
        <view class="result-tips">我们将尽快发货，当您收到作品时，请当面验收快递包裹后再签收。</view>
      </view>
      <!-- 支付失败的文案 -->
      <view class="form-item-block result-info" v-else>
        <view class="result-icon">
          <text class="icon-font icon-icon-zhifushibai"></text>
        </view>
        <view class="result-msg">支付尚未成功，请重新支付</view>
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
      <view class="form-item-block order-brief">
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
      <view class="form-item-block distribution">
        <view class="form-item-title">
          <view class="title-left"> 配送信息 </view>
          <view class="title-right"></view>
        </view>
        <view class="distribution-info">
          <view class="addressee">
            <text class="name">{{get(orderInfo, 'receiptInfo.name')}}</text>
            <text>{{get(orderInfo, 'receiptInfo.mobile')}}</text>
          </view>
          <view class="address-detail">
            {{addressDetail}}
          </view>
        </view>
      </view>
      <!-- 订单摘要 -->
      <view class="form-item-block">
        <view class="form-item-title last">
          <view class="title-left">
            订单摘要 <text>(共{{ totalQuantity }}件)</text>
          </view>
          <view class="title-right"></view>
        </view>
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
      <view class="order-info">
        <view class="info-item">
          <view class="info-title">商品金额</view>
          <view class="value"
            >{{ get(orderInfo, 'amount.amount') | currency}} </view
          >
        </view>
        <view class="info-item">
          <view class="info-title">运费</view>
          <view class="value">免运费</view>
        </view>
        <view class="info-item">
          <view class="info-title">总计</view>
          <view class="value"
            >{{ get(orderInfo, 'amount.amount') | currency}} </view
          >
        </view>
      </view>
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
import OrderProductItem from '@/components/orderProductItem';
import customButton from '@/components/button/normal.vue';
import navBarHeight from '@/components/common/navBarHeight';
import { get } from '@/utils/utilityOperationHelper';
import utils from '@/utils/utils';

export default {
  components: { OrderProductItem, customButton },
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
.pay-result-container {
  .container {
    padding-bottom: calc(128rpx + var(--safe-area-inset-bottom));
    padding-top: 178rpx;
    background-color: #f9f9f9;
    .service-btn {
      display: inline;
      background: transparent;
      line-height: 1;
      text {
        margin-left: 4rpx;
        font-size: 28rpx;
        color: #8e8e8e;
        text-decoration: underline;
      }
    }
    .order-info {
      padding: 56rpx 32rpx;
      .info-item {
        display: flex;
        justify-content: space-between;
        font-size: 28rpx;
        color: #000000;
        &:nth-child(1) {
          padding-bottom: 32rpx;
        }
        &:nth-child(2) {
          padding-bottom: 48rpx;
          border-bottom: 2rpx solid #bbbbbb;
        }
        &:nth-child(3) {
          padding-top: 56rpx;
        }
      }
    }
  }
  .result-info {
    padding: 56rpx 32rpx !important;
    text-align: center;
    margin-bottom: 20rpx;
    .result-icon {
      margin-bottom: 32rpx;
      image {
        width: 60rpx;
        height: 60rpx;
      }
      .icon-font {
        font-size: 60rpx;
      }
    }
    .result-msg {
      margin-bottom: 48rpx;
      font-size: 32rpx;
      color: #1d1d1d;
    }
    .result-tips {
      font-size: 28rpx;
      color: #8e8e8e;
    }
  }
  .order-brief {
    padding: 48rpx 32rpx !important;
    margin-bottom: 20rpx;
    .brief-item {
      margin-bottom: 40rpx;
      color: #1d1d1d;
      font-size: 28rpx;
      .label {
        margin-right: 8rpx;
      }
      &-last {
        margin: 0;
      }
    }
  }

  .last-product {
    /deep/ .product-box {
      padding: 0;
      .item-box {
        border: none;
      }
    }
  }
  .form-item-block {
    background: #fff;
    padding: 0 32rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    &.distribution {
      margin: 0;
      .form-item-title {
        height: 120rpx !important;
        border: none;
      }
      .distribution-info {
        font-size: 28rpx;
        border-bottom: 2rpx solid #f4f4f4;
        .addressee {
          margin-bottom: 20rpx;
          font-size: #1d1d1d;
          .name {
            margin-right: 30rpx;
          }
        }
        .address-detail {
          color: #616161;
          margin-bottom: 40rpx;
        }
      }
    }
    .form-item-title {
      display: flex;
      height: 132rpx;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2rpx solid #f4f4f4;
      font-size: 32rpx;
      color: #252525;
      .title-left {
        text {
          font-size: 28rpx;
        }
      }
      &.sub {
        height: 120rpx;
      }
      &.center {
        justify-content: center;
      }
      &.last {
        border: none;
      }
      &.address-row {
        height: auto;
        min-height: 120rpx;
        .address-info {
          padding: 32rpx 0;
          font-size: 28rpx;
          color: #1b1b1b;
          .phone-text {
            color: #313131;
            margin-left: 36rpx;
          }
          .address-detail {
            margin-top: 32rpx;
          }
          .form-error {
            color: #e4210d;
            margin-top: 32rpx;
          }
        }
      }
      .icon-font {
        margin-right: 12rpx;
        color: #bbbbbb;
        font-size: 32rpx;
        &.icon-icon-dingwei,
        &.icon-icon-youjiantou {
          color: #1d1d1d;
        }
      }

      .title-right {
        font-size: 28rpx;
      }
    }
    .text-28 {
      font-size: 28rpx;
    }
    .form-item-label {
      display: flex;
      margin-bottom: 48rpx;
    }
    /deep/ .checkbox {
      height: 32rpx;
      margin-right: 20rpx;
    }
    .form-item-input {
      // margin: 48rpx 0;
      margin-bottom: 48rpx;
      position: relative;
      input {
        height: 40px;
        padding: 0 32rpx;
        background: #f9f9f9;
      }
      .error-wrap {
        position: absolute;
        top: 100%;
        left: 0;
        /deep/ {
          .form-error {
            font-size: 24rpx;
            margin-top: 8rpx;
          }
        }
      }
    }
  }
  .fixed-button-wrap {
    position: fixed;
    left: 0;
    bottom:0;
    width: 100%;
    padding-bottom: var(--safe-area-inset-bottom);
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    .button-container {
      display: flex;
      align-content: center;
      justify-content: center;
      height: 128rpx;
      padding: 24rpx 0;
    }
  }
}
</style>
