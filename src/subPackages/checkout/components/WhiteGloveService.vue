<template>
  <view class="white-glove-service">
    <view class="left">
      <view>专属礼遇</view>
      <!-- <image class="img" :src="require('../../../assets/images/icon/white-gloves-1.svg')"/> -->
    </view>
    <view class="right">
      <view class="text">尊享专使递送服务</view>
      <slot></slot>
    </view>
  </view>
</template>

<script>

export default {
  name: 'whiteGloveService',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    props: 'value',
    event: 'input',
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.white-glove-service {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    height: 206rpx;
    text-align: center;
    .img {
      position: absolute;
      width: 145rpx;
      height: 230rpx;
      left: -22rpx;
      top: 9rpx;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .text {
      margin-right: 40rpx;
    }
  }
}
</style>
