<template>
    <view class="order-amount-box">
        <view class="price-content">
            <view class="info-item">
              <view>商品小计</view>
              <view class="value">{{ orderAmount | currency }}</view>
            </view>
            <view class="info-item">
              <view class="info-title">运费</view>
              <view class="value">免费</view>
          </view>
        </view>
        <view class="total-content">
          <view>总计</view>
          <view class="value">{{ orderAmount | currency}}</view>
        </view>
    </view>
</template>

<script>
import { get } from '@/utils/utilityOperationHelper';
import { currency } from '@/filters';

export default {
  name: 'OrderInfoContent',
  props: {
    orderAmount: {
        type: Number,
        default: 0
    }
  },
  methods: {
    get
  },
  filters: {
    currency
  }
}
</script>

<style lang="scss" scoped>
    @import '@/styles/base';
     .order-amount-box {
        background:  #f7f7f7;
        padding: 0 rpx(15);
        font-size: rpx(14);
        color: #1D1D1D;
        font-family: 'PingFangSC, PingFangSC-Regular';
        font-weight: 400;
      .price-content {
        padding: rpx(22) 0 rpx(20) 0;
        border-bottom: 1px solid #bbb;
        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: rpx(7);
        }
      }
      .total-content {
        display: flex;
        justify-content: space-between;
        padding: rpx(20) 0;
      }
    }
</style>