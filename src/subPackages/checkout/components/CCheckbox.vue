<template>
  <view class="checkbox-wrapper" @tap="handleTap">
    <view class="checkbox" >
      <view class="icon icon-unchecked"></view>
      <view :class="['icon',{'icon-checked':value}]"></view>
    </view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  methods: {
    handleTap() {
      this.$emit('input', !this.value);
      this.$emit('change', !this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  display: flex;
  align-items: center;
}
.checkbox {
  position: relative;
  height: 30rpx;
  width: 30rpx;

  .icon {
    position: absolute;
    left: 0rpx;
    top: 0;
    height: 30rpx;
    width: 30rpx;
    background-size: 30rpx 30rpx;
    background-repeat: no-repeat;
    background-position: center left;
  }

  @keyframes transition {
    0% {
      width: 0;
    }
    to {
      width: 30rpx;
    }
  }
  .icon-checked {
    animation: transition ease-in 0.3s forwards;
    background-position: -1rpx -1rpx;
    // background-image: url('../../../assets/images/icon/checkbox-selected.png');
  }
  .icon-unchecked {
    // background-image: url('../../../assets/images/icon/checkbox-bg.png');
  }
}
</style>
