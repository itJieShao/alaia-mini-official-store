<template>
  <view class="order-brief">
    <view class="brief-item">
      <text class="label">订单编号：</text>
      <text class="value">{{ orderCode }}</text>
    </view>
    <view class="brief-item">
      <text class="label">下单时间：</text>
      <text class="value">{{ orderTime }}</text>
    </view>
    <view class="brief-item">
      <text class="label">订单金额：</text>
      <text class="value">{{ orderPrice | currency }}</text>
    </view>
    <view v-if="billInfo" class="brief-item">
      <text class="label">发票信息</text>
      <text class="value">{{ billInfo }}</text>
    </view>
  </view>
</template>

<script>
import utils from '@/utils/utils';

export default {
  name: 'OrderDetailInfo',
  props: {
    orderCode: {
      type: String,
      default: () => '',
    },
    orderTime: {
      type: String,
      default: () => '',
    },
    orderPrice: {
      type: String,
      default: () => '',
    },
    billInfo: {
      type: Object,
      default: () => null,
    }
  },
  filters: {
    currency(value) {
      if (!value && value !== 0) return '0';
      return utils.currency(value);
    },
  }
}
</script>

<style lang="scss" scoped>
  @import './index';
</style>
