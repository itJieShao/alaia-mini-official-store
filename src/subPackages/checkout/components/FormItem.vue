<template>
  <view class="form-item">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name:'FormItem'
};
</script>

<style lang="scss" scoped>
.form-item {
  margin-top: 25rpx;
  padding-bottom: 10rpx;
}
</style>