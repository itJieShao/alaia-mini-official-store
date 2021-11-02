<template>
  <view class="order-summary-info">
    <view class="title">订单摘要 <text class="num">(共{{ totalQuantity }}件)</text></view>
    <view class="order-product-list">
      <view v-for="(product, index) in productList"
        :key="product.code">
        <OrderProductItem isLink :product="{ ...product, gaIndex: index + 1 }"/>
      </view>
    </view>
  </view>
</template>

<script>
import OrderProductItem from '@/components/al-orderProductItem';
import { splitCartQuantity } from '@/utils/cart';

export default {
  name: 'OrderProductList',
  props: {
    products: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      productList: []
    }
  },
  watch: {
    products (newValues) {
      if (newValues.length > 0) {
        this.productList = splitCartQuantity(newValues);
      }
    }
  },
  components: { OrderProductItem },
  computed: {
    totalQuantity() {
      return this.productList.reduce((total, v) => total + v.quantity, 0);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/styles/base';
  .order-summary-info {
      background: #fff;
      padding: rpx(20) 0;
      .title {
        font-size: rpx(14);
        .num {
          font-size: rpx(12);
        }
      }
    }
</style>
