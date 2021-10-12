<template>
  <view :class="['panel-title', className]" @tap="handleTap">
    <text class="title" v-if="title">{{title}}</text>
    <view v-if="showIcon" :class="[opened && changeIcon?'icon-down-plus':'icon-up-plus', 'status']">{{ status }}</view>
  </view>
</template>

<script>
export default {
  name: 'PanelTitle',
  props: {
    title: {
      type: String,
    },
    showIcon: {
      type: Boolean,
      default() {
        return true;
      },
    },
    changeIcon: {
      type: Boolean,
      default() {
        return true;
      },
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    // order-title  checkout-title
    className: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      opened: false,
    };
  },
  watch: {
    isOpen: {
      handler(newVal) {
        this.opened = newVal
      },
      immediate: true,
    },
  },
  methods: {
    handleTap() {
      this.opened = !this.opened;
      this.$emit('panelTitleTap');
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-title {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 50rpx;
  line-height: 50rpx;
  &.order-title {
    height: 33rpx;
    line-height: 33rpx;
    font-size: 26rpx;
    color: #b9b9b9;
  }
  .title {
    width: 60%;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .status {
    margin-right: 65rpx;
  }

  &.checkout-title {
    .status {
      margin-right: 40rpx;
      font-weight: 300;
      color: #999;
    }
    .icon-up-plus:after{
      margin-top: -10rpx;
    }
  }
}
</style>
