<template>
  <view class="order-brief">
    <view class="brief-item">
      <text class="label">订单编号：</text>
      <text class="value">{{ orderCode }}</text>
    </view>
    <view class="brief-item">
      <text class="label">下单时间：</text>
      <text class="value">{{ orderTime | dateFormat }}</text>
    </view>
    <view class="brief-item">
      <text class="label">订单金额：</text>
      <text class="value">{{ orderPrice | currency }}</text>
    </view>
    <view v-if="billInfo" class="brief-item">
      <text class="label">发票信息：</text>
      <text class="value">{{ billInfo.titleType === INVOICE_TITLE_TYPE.COMPANY ? '公司' : '个人' }} {{ billInfo.title || ''  }} {{ billInfo.taxNo || '' }}</text>
    </view>
  </view>
</template>

<script>
import { currency, dateFormat } from '@/filters';
import { INVOICE_TITLE_TYPE } from '@/constants/order';

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
  data() {
    return {
      INVOICE_TITLE_TYPE
    }
  },
  filters: {
    currency,
    dateFormat
  }
}
</script>

<style lang="scss" scoped>
  @import './index';
</style>
