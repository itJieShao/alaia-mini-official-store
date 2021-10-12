<template>
  <view class="form-title">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'FormTitle'
};
</script>

<style lang="scss" scoped>
.form-title {
  font-size: 20rpx;
  color: #666;
}
</style>