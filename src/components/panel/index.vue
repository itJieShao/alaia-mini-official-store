<template>
  <view :class="['panel', {'bottom-line': isShowBottomLine}]">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'Panel',
  props: {
    isShowBottomLine: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.panel {
  padding: 20rpx 0 20rpx;
  &.bottom-line {
    border-bottom: 1rpx solid #4e5153;
  }
}
</style>
