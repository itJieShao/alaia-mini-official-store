<template>
  <view class="pay-result">
    <!-- 重新支付成功的弹窗 start -->
    <view class="rest-pay-content" v-if="isRePay">
      <view class="restPay-box">
        <!-- <image class="restPay-image" :src="require('../../assets/images/icon/rest-success.png')"></image> -->
        <view class="pay-text">您已成功支付尾款并完成购买</view>
        <view class="pay-text">您的商品我们会尽快为您发出</view>
        <view class="pay-backHome" @click="handleGoBackHome">返回</view>
      </view>
    </view>
    <!-- 重新支付成功的弹窗 end -->
    <view v-else>
      <view class="header">
        <text>订购成功</text>
      </view>
      <view class="content">
        <view class="text">感谢您的订购。</view>
        <view class="text">我们将尽快为您核实订单并发货。 </view>
      </view>
      <view class="button">
        <button @click="handleViewOrder">
          <text>查看订单</text>
        </button>
      </view>
    </view>
  </view>
</template>
<script>
import { mapActions } from 'vuex'
import { trackerPayPageView, trackerClick, EVENT_TYPE } from '@/utils/ga'

export default {
  name: 'PayResult',
  data() {
    return {
      orderId: '',
      isRePay: false,
    }
  },
  onLoad({ orderId, isRePay }) {
    this.orderId = orderId
    this.isRePay = isRePay
  },
  onShow() {
    if (this.orderId) {
      this.getOrderDetail(this.orderId).then((res) => {
        trackerPayPageView(res)
      })
    }
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  methods: {
    ...mapActions('order', ['getOrderDetail']),
    handleViewOrder() {
    },
    handleGoBackHome() {
      uni.switchTab({
        url: '/pages/index/index',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.pay-result {
  background: #2f3335;
  color: #fff;
  padding: 60rpx 40rpx 60rpx;
  height: 92vh;
  box-sizing: border-box;
  text-align: center;
  letter-spacing: 1rpx;
  .header {
    font-size: 46rpx;
  }
  .content {
    padding: 50rpx 0 80rpx;
    .text {
      font-size: 30rpx;
      line-height: 45rpx;
    }
  }
  .button {
    button {
      border-radius: 6rpx;
      color: #fff;
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
      letter-spacing: 3rpx;
      background: #606362;
      background: -webkit-linear-gradient(left, #6e706e, #525555);
      background: linear-gradient(to right, #6e706e, #525555);
    }
  }

  .rest-pay-content {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(99, 96, 96, 0.9);
    .restPay-box {
      width: 100%;
      height: 460rpx;
      background-color: #333;
      margin-top: 34%;
      overflow: hidden;
      .restPay-image {
        width: 70rpx;
        height: 70rpx;
        display: block;
        margin: 0 auto;
        margin-top: 70rpx;
        margin-bottom: 44rpx;
      }
      .pay-text {
        color: #fff;
        font-size: 28rpx;
        text-align: center;
        line-height: 38rpx;
      }
      .pay-backHome {
        width: 60%;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        margin: 0 auto;
        margin-top: 50rpx;
        background-color: #636060;
        color: #fff;
        font-size: 36rpx;
      }
    }
  }
}
</style>
