<template>
  <scroll-view class="products-list" scroll-x="true" bindscroll="scroll">
    <view class="item" v-for="(item,index) in products" :key="index" @click="handleProductClick(item)">
      <image class="cover" :src="imgUrlReplace(item.productImg, 375, 375)" :lazy-load="true" mode="aspectFit"></image>
      <view class="info">
        <view class="title">{{item.productName}}</view>
        <view class="price" v-show="item.productPrice">￥{{ priceFormat(item.productPrice) || 0 }}</view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { priceFormat, imgUrlReplace } from '@/utils/utils';

export default {
  name: 'productSwiper',
  props: {
    products: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    priceFormat,
    imgUrlReplace,
    handleProductClick (item) {
      this.$emit('clickItem', item)
    },
    scroll () { },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.products-list {
  padding-left: rpx(16);
  white-space: nowrap;
  .item {
    display: inline-block;
    width: rpx(165);
    margin-right: rpx(8);
    text-align: center;
    .cover {
      width: 100%;
      height: rpx(227);
      background-color: #f7f7f7;
    }
    .info {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      padding: 0 rpx(10);
      padding-bottom: rpx(60);
      background-color: #fff;
    }
    .title {
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: rpx(12);
      font-weight: 400;
      line-height: rpx(14);
      margin-top: rpx(15);
      white-space: initial;
      color: #1d1d1d;
    }
    .price {
      font-family: Lato, Lato-Regular;
      font-size: rpx(12);
      font-weight: 400;
      line-height: rpx(14);
      margin-top: rpx(4);
      color: #1d1d1d;
    }
  }
}

</style>
