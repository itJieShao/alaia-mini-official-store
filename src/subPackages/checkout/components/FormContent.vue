<template>
  <view class="form-content">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'FormContent',
};
</script>

<style lang="scss" scoped>
.form-content {
  display: flex;
  justify-content: space-between;
}
</style>