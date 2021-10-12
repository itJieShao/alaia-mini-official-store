<template>
  <view>
    <view class="checkbox" :class="iconBox ? 'icon-box' : ''" @tap="checkEventer" v-if="disabled">
      <view class="icon icon-dischecked"></view>
    </view>
    <view class="checkbox" :class="iconBox ? 'icon-box' : ''" @tap="checkEventer" v-else>
      <!-- <view class="icon" :class="!iconStyle ? 'icon-unchecked' : 'icon-style'"></view> -->
      <view class="icon" :class="isChecked ? 'icon-checked' : ''"></view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    iconStyle: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    iconBox: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isChecked: this.checked,
    };
  },
  methods: {
    checkEventer() {
      if (!this.disabled) {
        this.$emit('checkEvent', {
          value: this.value,
          checked: !this.checked,
        });
      }
    },
  },
  watch: {
    checked(newValue) {
      console.log('check', newValue)
      this.isChecked = newValue;
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox {
  position: relative;
  // height: 100rpx;
  width: 32rpx;
}
.checkbox .icon {
  position: absolute;
  left: 0rpx;
  top: 0rpx;
  height: 32rpx;
  width: 32rpx;
  border-radius: 50%;
  border: 2rpx solid #BBBBBB;
  background-size: 30rpx 30rpx;
  background-repeat: no-repeat;
  background-position: center left;
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 56rpx;
    height: 56rpx;
    // background: #e83474;
  }
}

@keyframes transition {
  0% {
    width: 0;
  }
  to {
    width: 50rpx;
  }
}
.checkbox .icon.icon-checked {
  background:#E3F0EA;
  border-color: #1D1D1D;
  // animation: transition ease-in 0.3s forwards;
  // background-position: -1rpx 10rpx;
  // background-image: url('../../assets/images/icon/checkbox-selected.png');
}
.checkbox .icon-dischecked {
  border-color: #BBBBBB;
  background-color: #E6E6E6;
}
.checkbox .icon.icon-style {
  width: 22rpx;
  height: 22rpx;
  background: #000;
  border: 2rpx solid #fff;
  margin-top: 12rpx;
}
.checkbox .icon.icon-unchecked {
  // background-image: url('../../assets/images/icon/checkbox-bg.png');
}

.icon-box {
  height: 30rpx;
}
.icon-box .icon {
  top: -5rpx;
}
</style>
