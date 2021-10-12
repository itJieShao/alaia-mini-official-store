<template>
  <view class="tabbar">
    <view class="tabbar-item" :class="{actived: bindValue === 'product'}" @tap="bindValue = 'product' ">产品</view>
    <view class="tabbar-item" :class="{actived: bindValue === 'story'}" @tap="bindValue = 'story'">故事</view>
  </view>
</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: 'product',
    },
    code: {
      type: String,
      default: '',
    },
    select: {
      type: String,
      default: 'product',
    },
  },
  computed: {
    bindValue: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.tabbar {
  display: flex;
  align-content: center;
  justify-content: center;
  height: 90rpx;
  font-size: 26rpx;

  &-item {
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    width: 200rpx;
    color: #969696;
    justify-content: center;

    &.actived {
      color: #fff;

      &::after {
        content: "";
        position: absolute;
        bottom: -4rpx;
        height: 4rpx;
        width: 50rpx;
        left: 0;
        right: 0;
        margin: auto;
        background-color: #fff;
      }
    }
  }
}
</style>
