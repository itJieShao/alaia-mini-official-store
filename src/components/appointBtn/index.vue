<template>
  <view class="appoint">
    <button :class="className" @tap.native="handleGetUserInfo" :style="{width: `${width}rpx`}">
      <slot></slot>
    </button>
  </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { toThirdMiniProgram } from '../../utils/crm'

export default {
  props: {
    // transparent， mini-btn， pdp-btn
    className: {
      type: String,
      default: '',
    },
    wdith: {
      type: Number,
      default: 439,
    },
  },
  computed: {
    ...mapGetters('user', ['unionId', 'userInfo']),
    ...mapGetters('common', ['appletChannel']),
  },
  methods: {
    ...mapActions('user', ['decryptData', 'setIsNeedToThirdProgram']),
    handleClick() {
      this.$emit('click')
    },
    async handleGetUserInfo() {
      if (this.unionId) {
        this.handleHowToJump()
        return
      }

      let encryptedData = ''
      let iv = ''
      try {
        // uni 的方式调用会返回数组，且没文档解释
        ({ encryptedData = '', iv = '' } = await wx.getUserInfo())
      } catch (error) {
        console.log('基础库版本过低getUserInfo失败', error)
      }

      this.commonFun(encryptedData, iv)
    },
    async commonFun(encryptedData, iv) {
      try {
        await this.decryptData({
          encryptedData,
          iv,
        })
      } catch (error) {
        console.log('解析失败', error)
      } finally {
        // 判断是否登陆
        this.handleHowToJump()
      }
    },
    handleHowToJump() {
      const { mobile } = this.userInfo;
      if (mobile) {
        // 跳转到第三方小程序
        toThirdMiniProgram(this.unionId, this.appletChannel).then((error) => {
          this.$emit('toThirdMiniProgram', error)
        })
      } else {
        this.setIsNeedToThirdProgram(true)
      }

      this.$emit('click')
    },
  },
}
</script>

<style lang="scss" scoped>
.appoint {
  display: flex;
  justify-content: center;
  align-content: center;
  .transparent {
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
  .mini-btn {
    width: 315rpx !important;
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
  .pdp-btn {
    width: 315rpx !important;
    height: 56rpx;
    color: #ffffff;
    font-size: 26rpx;
    background-color: #555759;
    border-radius: 6rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: normal;
    margin: 0 auto;
  }
}
</style>
