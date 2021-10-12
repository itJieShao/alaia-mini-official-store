<template>
  <view>
    <view
      class="popup"
      :class="[`popup--${type}`]"
      v-if="show"
      :style="[{'z-index': zIndex}]"
    >
      <view
        class="popup-backdrop"
        :class="animatecls[1]"
        catchtouchmove="ture"
        @tap="clickCloseBackdrop"
      ></view>
      <view
        class="popup-content"
        :class="[animatecls[0], `popup__content__${type}`, styleType ? 'blockStyle' : '']"
        :style="[contentStyle]"
      >
        <view class="cancel" @tap="cancel">
          <image class="cancel-img" mode="widthFix" :src="require('./cancel.png')"></image>
        </view>
        <slot name="header">
          <view class="header" v-if="title">
            <text>{{ title }}</text>
          </view>
        </slot>
        <!-- 自定义内容 slot start -->
        <slot>
          <view class="content" v-if="content">
            <text>{{ content }}</text>
          </view>
        </slot>
        <!-- 自定义内容 slot end -->

        <!-- 自定义按钮文字的footer start -->
        <view class="footer" v-if="showOtherBtn">
          <view v-if="cancelText && !certainTitle">
            <view class="box" v-if="cancelText">
              <view @tap="cancel" class="cancel-btn">
                <text>{{ cancelText }}</text>
              </view>
            </view>
          </view>
          <template v-else>
            <view class="box" v-if="certainTitle">
              <view @tap="certain" class="other-btn-buy-now">
                <text>{{ certainTitle }}</text>
              </view>
            </view>
            <view class="box" v-if="cancelText">
              <view @tap="cancel" class="other-btn-continue">
                <text>{{ cancelText }}</text>
              </view>
            </view>
          </template>
        </view>
        <!-- 自定义按钮文字的footer end -->
        <view class="footer" v-if="!showOtherBtn">
          <view class="box">
            <z-button type="primary" @tap="certain">
              <text>{{ certainTitle }}</text>
            </z-button>
          </view>
          <view class="box" v-if="popup.cancelTitle">
            <z-button type="primary" @tap="cancel">
              <text>{{ popup.cancelTitle }}</text>
            </z-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import zButton from '../button';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    },
    certainTitle: {
      type: String,
      default: '',
    },
    closeOnClickBackdrop: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'bottom',
    },
    animation: {
      type: String,
      default: 'slideDown',
    },
    zIndex: {
      type: Number,
      default: 1001,
    },
    distance: {
      type: Number,
      default: 0,
    },
    styleType: {
      type: Boolean,
      default: false,
    },
    showOtherBtn: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      animatecls: ['animate__slideDown_out', 'animate__fade_out'],
      popup: {
        title: '',
        certainTitle: '确定',
      },
    };
  },
  computed: {
    contentStyle() {
      const result = {}
      if (this.type !== 'normal') {
        result[`margin-${this.type}`] = `${this.distance}rpx`
      }
      return result
    },
  },
  methods: {
    onShow(option) {
      console.log('popup show', option);
      const popup = {};
      this.popup = Object.assign(popup, option);
      this.animatecls = [`animate__${this.animation}_in`, 'animate__fade_in'];
    },
    hide() {
      this.animatecls = [`animate__${this.animation}_out`, 'animate__fade_out'];
      this.$emit('hideEvent')
    },
    certain() {
      this.hide();
      setTimeout(() => {
        this.$emit('certain')
      }, 500)
    },
    handleCancel() {
      this.hide();
      this.$emit('cancel')
    },
    cancel() {
      this.hide();
      this.$emit('cancel')
    },
    clickCloseBackdrop() {
      this.$emit('close')
    },
  },
  components: {
    zButton,
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
