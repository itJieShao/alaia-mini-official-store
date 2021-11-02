<template>
  <view :class="[
      classes,
      { 'nav-bar-border': headBorder },
      { 'nav-bar-blank': headBlank },
      { 'nav-bar-font-color': headFontColor },
    ]" :style="styles">
    <view class="nav-bar-left" v-if="leftArrow" @click="onClickLeft(leftIcon)">
      <text class="icon-font" :class="[
          leftIcon === 'left' ? 'icon-zuoyoujiantou' : '',
          hasLeftRadius ? 'has-left-radius' : '',
          leftIcon === 'search' ? 'icon-search' : '',
        ]"></text>
      <text v-if="!$slots.left && leftText" class="nav-bar-text">
        {{ leftText }}
      </text>
      <slot v-if="$slots.left" name="left" />
    </view>
    <view class="nav-bar-title">
      <block v-if="!$slots.title && title == 'logo'">
        <text class="icon-font icon-logo-alaia_000"></text>
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
    hasLeftRadius: { type: Boolean, default: false }, // 返回按钮是否带白色小圆圈
  },
  computed: {
    classes () {
      return bem('nav-bar', { fixed: this.fixed });
    },
    styles () {
      return `z-index: ${this.zIndex};${this.safeAreaInsetTop ? `padding-top: ${this.statusBarHeight}px;` : ''
        }${this.customStyle}`;
    },
  },
  methods: {
    onClickLeft (icon) {
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

<style lang="scss" scoped>
  @import './index';
</style>
