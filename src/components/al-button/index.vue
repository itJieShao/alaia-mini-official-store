<template>
  <view>
    <view class="getPhoneNumber" v-if="openType == 'getUserInfo'">
      <button
        class="control"
        :class="[`btn-${type}`]"
        hover-class="control-opacity-active"
        :plain="plain"
        :open-type="openType"
        :disabled="disabled"
        @getuserinfo="getUserInfoEventer"
      >
        <slot></slot>
      </button>
    </view>
    <view class="getPhoneNumber" v-if="openType == 'getPhoneNumber'">
      <button
        class="control"
        :class="[`btn-${type}`]"
        hover-class="control-opacity-active"
        :plain="plain"
        :open-type="openType"
        :disabled="disabled"
        @getphonenumber="getPhoneNumberEventer"
      >
        <slot></slot>
      </button>
    </view>
    <view class="share" v-if="openType == 'share'">
      <button
        class="control"
        :class="[`btn-${type}`]"
        hover-class="control-opacity-active"
        :plain="plain"
        :open-type="openType"
        :disabled="disabled"
      >
        <slot></slot>
      </button>
    </view>
    <view class="contact" v-if="openType == 'contact'">
      <button
        class="control"
        :class="[`btn-${type}`]"
        hover-class="control-opacity-active"
        :plain="plain"
        :open-type="openType"
        :disabled="disabled"
        :session-from="contact.sessionFrom"
        :send-message-title="contact.title"
        :send-message-path="contact.path"
        :send-message-img="contact.img"
        :show-message-card="contact.showCard"
        @contact="contactEventer"
      >
        <slot></slot>
      </button>
    </view>
    <view class="openSetting" v-if="openType == 'openSetting'">
      <button
        class="control"
        :class="[`btn-${type}`]"
        hover-class="control-opacity-active"
        :plain="plain"
        :open-type="openType"
        :disabled="disabled"
        @opensetting="openSettingEventer"
      >
        <slot></slot>
      </button>
    </view>
    <view class="normal" v-if="openType == 'normal'">
      <form @submit="submitEventer" report-submit="true">
        <button
          class="control"
          :class="[`btn-${type}`]"
          hover-class="control-opacity-active"
          :plain="plain"
          formType="submit"
          :disabled="disabled"
        >
          <slot></slot>
        </button>
      </form>
    </view>
    <view v-if="openType === 'transparent'" class="default">
      <button @click="handleClick" class="default-btn" :style="{width: `${width}rpx`}">
        <slot></slot>
      </button>
    </view>
    <view v-if="openType === 'big-btn'" class="default">
      <button @click="handleClick" class="default-btn-big" :style="{width: `${width}rpx`}">
        <slot></slot>
      </button>
    </view>
    <view v-else-if="openType === 'mini-btn'" class="mini">
      <button @click="handleClick" class="mini-btn">
        <slot></slot>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    openType: {
      type: String,
      default: 'normal',
    },
    contact: {
      type: Object,
      default: () => {},
    },
    wdith: {
      type: Number,
      default: 439,
    },
    type: {
      type: String,
      default: '',
    },
  },
  methods: {
    submitEventer() {
      // 函数回调
      this.$emit('emiteventer', {})

      // 上报FormId
      // api.addFromId({
      //   formId: event.detail.formId,
      //   source: 'normal',
      //   openId: wx.getStorageSync('D1M_OPENID').value,
      //   wechatId: config.wechatId,
      // });
    },
    // - contact
    contactEventer({ detail = {} } = {}) {
      this.$emit('contact', detail)
    },

    // getPhoneNumber
    getPhoneNumberEventer({ detail = {} } = {}) {
      this.$emit('getphonenumber', detail)
    },

    openSettingEventer({ detail = {} } = {}) {
      this.$emit('opensetting', detail)
    },
    handleClick() {
      this.$emit('click')
    },
  },
};
</script>

<style lang="scss" scoped>
.control {
  transition: all 0.3s ease-in-out;
}

.control-opacity-active {
  opacity: 0.5;
}

button {
  background: transparent;
  border: none;
  height: 80rpx;
  border: 1px solid #666666;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6rpx;
  background-color: #626463;
  line-height: normal;
}

.default-btn, .default-btn-big {
  margin-left: auto;
  margin-right: auto;
  width: 439rpx;
  height: 80rpx;
  font-family: 'FZHTJW-animate-font';
  border: 2rpx solid #FFFFFF;
  border-radius: 5rpx;
  color: #FFFFFF;
  line-height: 83rpx;
  background-color: transparent;
  font-size: 28rpx;
}
.default-btn-big {
  width: 440rpx;
  font-size: 32rpx;
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
    border-radius: 6rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: normal;
    border: none;
  }
}
</style>
