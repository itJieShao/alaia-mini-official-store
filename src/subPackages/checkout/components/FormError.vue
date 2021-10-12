<template>
  <view class="form-error">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'FromError',
};
</script>

<style lang="scss" scoped>
.form-error {
  margin-top: 5rpx;
  color: #c83232;
}
</style>