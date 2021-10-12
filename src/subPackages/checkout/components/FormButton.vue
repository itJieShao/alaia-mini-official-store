<template>
  <view>
    <button
      v-if="!openType"
      :class="['form-button',{'form-button-disabled':disabled}]"
      :style="width?`width:${width}rpx`:'width:100%'"
      @tap="handleTap">
      <slot></slot>
    </button>
    <button v-if="openType==='getPhoneNumber'" :class="['form-button',{'form-button-disabled': disabled }]" open-type="getPhoneNumber"
      :style="width?`width:${width}rpx`:'width:100%'" @getphonenumber="handleTap">
      <slot></slot>
    </button>
  </view>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
    },
    openType: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  methods: {
    handleTap(e) {
      if (!this.disabled) {
        this.$emit('formButtonTap', e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-button {
  height: 50rpx;
  line-height: 50rpx;
  border-radius: 5rpx;
  background-color: #6d6f6d;
  color: #fff;
  border: 0 solid transparent;
  font-size: 26rpx;
  letter-spacing: 3rpx;
}
.form-button-disabled{
  background-color: #999;
}
</style>
