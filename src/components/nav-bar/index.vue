<template>
  <view
    :class="[
      classes,
      { 'nav-bar-border': headBorder },
      { 'nav-bar-blank': headBlank },
      { 'nav-bar-font-color': headFontColor },
    ]"
    :style="styles"
  >
    <view class="nav-bar-left" v-if="leftArrow" @click="onClickLeft(leftIcon)">
      <label
        class="icon-font"
        :class="[
          leftIcon === 'left' ? 'icon-icon-zuo' : '',
          leftIcon === 'search' ? 'icon-icon-sousuo' : '',
        ]"
      ></label>
      <text v-if="!$slots.left && leftText" class="nav-bar-text">
        {{ leftText }}
      </text>
      <slot v-if="$slots.left" name="left" />
    </view>
    <view class="nav-bar-title">
      <block v-if="!$slots.title && title == 'logo'">
        <label class="icon-font icon-icon-logo"></label>
      </block>
      <block v-else-if="!$slots.title">{{ title }}</block>
      <slot v-else name="title" />
    </view>
  </view>
</template>

<script>
import customCls from '../common/custom-class';
import safeArea from '../common/safe-area';
import bem from '../common/bem';

export default {
  mixins: [safeArea({ safeAreaInsetTop: true }), customCls],
  name: 'navBar',
  props: {
    title: { type: String, default: 'logo' }, // 页面名
    fixed: { type: Boolean, default: true }, // fixed定位
    zIndex: { type: Number, default: 1001 }, // 层级
    leftIcon: { type: String, default: 'left' }, // 显示左返回按钮或其它按钮和事件
    leftText: String, // 左返回按钮文案
    leftArrow: { type: Boolean, default: true }, // 是否有左返回按钮或其它按钮
    headBorder: { type: Boolean, default: true }, // 是否header有下分割线
    headBlank: { type: Boolean, default: false }, // header是透明或白底
    headFontColor: { type: Boolean, default: false }, // 设置header字体颜色（黑白）
  },
  computed: {
    classes() {
      return bem('nav-bar', { fixed: this.fixed });
    },
    styles() {
      return `z-index: ${this.zIndex};${
        this.safeAreaInsetTop ? `padding-top: ${this.statusBarHeight}px;` : ''
      }${this.customStyle}`;
    },
  },
  methods: {
    onClickLeft(icon) {
      this.$emit('click-left');
      const curPages = getCurrentPages();
      console.log('点击header按钮--->', icon, curPages);
      if (curPages.length === 1) {
        this.leftIcon === 'search'
          ? uni.navigateTo({ url: '/subPackages/search/pages/index' })
          : uni.switchTab({ url: '/pages/index/index' });
      } else {
        this.leftIcon === 'left' && icon === 'left'
          ? uni.navigateBack()
          : uni.switchTab({ url: '/pages/index/index' });
      }
    },
  },
};
</script>

<style lang="scss">
@import "../../styles/utilities";
.nav-bar {
  position: relative;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-color: #fff;
  user-select: none;
  box-sizing: content-box;

  &-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding-top: 20px;
  }

  &.nav-bar-border {
    border-bottom: rpx(1) solid #F4F4F4;
  }

  &-title {
    max-width: 60%;
    height: 100%;
    margin: 0 auto;
    font-size: rpx(18);
    color: #1d1d1d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;

    .icon-font {
      font-size: rpx(20);
    }
  }

  &-left {
    position: absolute;
    bottom: 0;
    font-size: rpx(12);
    display: flex;
    min-width: 12%;
    padding-left: rpx(16);
    color: #1d1d1d;

    .nav-bar-text {
      margin-left: rpx(6);
      letter-spacing: rpx(1);
    }

    .icon-font {
      font-size: rpx(20);
    }

    .icon-icon-zuo {
      font-size: rpx(16);
      margin-left: rpx(-4);
    }
  }

  &.nav-bar-blank {
    background: transparent;
    // background: linear-gradient(
    //   180deg,
    //   rgba(60, 60, 60, 0.6) 0%,
    //   rgba(32, 32, 32, 0) 99.99%,
    //   rgba(138, 138, 138, 0.6) 100%
    // );
    .nav-bar-left,
    .nav-bar-title {
      color: #fff;
    }
  }

  &.nav-bar-font-color {
    .nav-bar-left,
    .nav-bar-title {
      color: #1d1d1d;
    }
  }
}
</style>
