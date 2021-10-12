<template>
  <view class="noraml">
    <view v-if="className === 'transparent'" class="default">
      <button @click="handleClick" class="btn default-btn" :style="{width: `${btnWidth}rpx`, height: `${btnHeight}rpx`}">
        <slot></slot>
      </button>
    </view>
    <view v-if="className === 'big-btn'" class="default">
      <button @click="handleClick" class="btn default-btn-big" :style="{width: `${btnWidth}rpx`, height: `${btnHeight}rpx`}">
        <slot></slot>
      </button>
    </view>
    <view v-else-if="className === 'mini-btn'" class="mini">
      <button @click="handleClick" class="btn mini-btn">
        <slot></slot>
      </button>
    </view>
    <view v-if="className === 'whiteBtn'" class="default whiteBtn">
      <button @click="handleClick" class="btn default-btn" :style="{width: `${btnWidth}rpx`, height: `${btnHeight}rpx`}">
        <slot></slot>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: '',
    },
    btnWidth: {
      type: Number,
      default: 439,
    },
    btnHeight: {
      type: Number,
      default: 80,
    },
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.normal{
  overflow: hidden;
}
.btn {
  background: transparent;
  border: none;
  border: 1px solid #666666;
  // color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  // border-radius: 6rpx;
  background-color: #626463;
  line-height: normal;
}

.default-btn, .default-btn-big {
  margin-left: auto;
  margin-right: auto;
  width: 439rpx;
  font-family: 'FZHTJW-animate-font';
  border: 1px solid #1D1D1D;
  // border-radius: 5rpx;
  color: #1D1D1D;
  line-height: 83rpx;
  background-color: transparent;
  font-size: 28rpx;
}

.default-btn-big {
  width: 440rpx;
  background: #E3F0EA;
  font-size: 28rpx;
}
.mini {
  display: flex;
  justify-content: center;
  align-content: center;
  .mini-btn {
    width: 315rpx;
    height: 56rpx;
    color: #ffffff;
    font-size: 26rpx;
    background-color: #555759;
    // border-radius: 6rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: normal;
    border: none;
  }
}
.default.whiteBtn{
  .default-btn{
    border: 1px solid #fff;
    color: #fff;
  }
}
</style>
