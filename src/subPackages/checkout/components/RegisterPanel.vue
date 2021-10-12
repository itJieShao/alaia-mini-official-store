<template>
  <panel>
    <panel-title title="注册会员" @panelTitleTap="handleTitleTap" :isOpen="true"></panel-title>
    <panel-content :show="showContent">
      <form-item>
        <form-title>注册会员手机号*</form-title>
        <form-content v-show="!isFulledPhone">
          <form-input :width="400" v-model="phone" @input="handlePhoneInput"></form-input>
          <form-button :width="250" open-type='getPhoneNumber' @formButtonTap="handleGetPhoneNumber">获取授权手机号
          </form-button>
        </form-content>
        <view v-show="isFulledPhone" class="phone-fulled">
          <text class="phone-number">{{phone}}</text>
          <text>*确认此手机号码为注册会员信息绑定</text>
          <view class="lines"></view>
        </view>
        <form-error v-show="isPhoneError">*手机号格式错误</form-error>
      </form-item>
      <form-item v-show="!isFulledPhone">
        <form-title>手机验证码*</form-title>
        <form-content>
          <form-input :width="400" v-model="captcha" @blur="handleCaptchaBlur"></form-input>
          <form-button :width="250" :disabled="captchaDisabled" @formButtonTap="handleCaptchTap">
            <text v-if="!captchaSending">获取验证码</text>
            <text v-else>{{seconds}}s后重新获取</text>
          </form-button>
        </form-content>
        <form-error v-show="captchaError">*{{ captchaError }}</form-error>
      </form-item>
    </panel-content>
  </panel>
</template>

<script>
import { mapActions } from 'vuex';
import Panel from '../../../components/panel';
import PanelTitle from '../../../components/panelTitle';
import PanelContent from '../../../components/panelContent';
import FormItem from './FormItem';
import FormTitle from './FormTitle';
import FormContent from './FormContent';
import FormInput from './FormInput';
import FormButton from './FormButton';
import FormError from './FormError';
import { get } from '../../../utils/utilityOperationHelper';
import {
  decryptData, sendSmsVerifyCode,
} from '../../../service/apis/account';
import utils from '../../../utils/utils';
import { USER_WX_INFO } from '../../../constants/user'
import { getErrorMessage } from '../../../constants/errorCode'

const CAP_ERROR = '请输入正确验证码'
export default {
  name: 'RegisterPanel',
  props: {
    mobile: {
      type: String,
      default: '',
    },
  },
  components: {
    Panel,
    PanelTitle,
    PanelContent,
    FormItem,
    FormTitle,
    FormContent,
    FormInput,
    FormButton,
    FormError,
  },
  data() {
    return {
      showContent: true,
      isPhoneError: false,
      captchaDisabled: true,
      captcha: '',
      captchaSending: false,
      seconds: 60,
      captchaError: '',
      phone: '',
      isInput: true,
      verifyToken: '',
      bindParams: {},
    };
  },
  computed: {
    isFulledPhone() {
      // 已经注册了手机号码
      return !!this.phone && !this.isInput
    },
  },
  watch: {
    mobile: {
      handler() {
        this.phone = this.mobile;
        if (this.mobile) {
          this.captchaDisabled = true;
          this.isInput = false;
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions('user', ['bindMobileByVerifyCode', 'bindMobileByEncryptedData']),
    handleTitleTap() {
      this.showContent = !this.showContent;
    },
    handlePhoneInput() {
      if (utils.isPhone(this.phone)) {
        this.isPhoneError = false
        this.captchaDisabled = false;
      } else {
        this.captchaDisabled = true;
      }
    },
    async handleGetPhoneNumber(e) {
      if (e.detail.errMsg !== 'getPhoneNumber:ok') {
        uni.showToast({
          title: '授权失败 请再次授权',
          icon: 'none',
        })
        return
      }
      const { detail } = e;
      try {
        if (detail.encryptedData && detail.iv) {
          this.isInput = false;
          this.bindParams = {
            encryptedData: detail.encryptedData,
            iv: detail.iv,
          }
          const result = await decryptData(this.bindParams);
          const errors = get(result, 'errors[0]')
          if (errors && errors.code) {
            uni.showToast({
              title: errors.message,
              icon: 'none',
            });
            return
          }
          const decrypt = get(result, 'data.decryptData')
          uni.setStorageSync(USER_WX_INFO, decrypt)
          const { phoneNumber } = JSON.parse(decrypt);
          this.phone = phoneNumber;
          this.captcha = ''
          this.isInput = false;
          this.captchaDisabled = true
          this.isPhoneError = false
        }
      } catch (error) {
        console.error('获取手机号码报错', error)
      }
    },
    handleCaptchaBlur() {
      this.captcha ? this.captchaError = '' : this.captchaError = CAP_ERROR
    },
    handleCaptchInput() {
      if (!this.isFulledPhone) {
        if (this.captcha && this.captcha.length === 6) {
          uni.showLoading({
            title: '加载中...',
          });
          return this.bindMobileByVerifyCode({
            input: {
              mobile: this.phone,
              verifyCode: this.captcha,
              messageAction: 'SMS_BIND_MOBILE',
              verifyToken: this.verifyToken,
            },
          }).then((res) => {
            uni.hideLoading()
            const errorCode = get(res, 'errors[0].code')
            if (!res || errorCode) {
              this.captchaError = getErrorMessage(errorCode, CAP_ERROR)
              uni.showToast({
                icon: 'none',
                title: getErrorMessage(errorCode, get(res, 'errors[0].message')),
              })
              return Promise.reject(Error(errorCode))
            }
            this.captchaError = ''
            return Promise.resolve()
          }).catch((e) => {
            uni.hideLoading()
            console.log('验证手机验证码出错', e)
            this.captchaError = getErrorMessage(e, CAP_ERROR)
            return Promise.reject(Error('验证手机验证码出错'))
          })
        }
        this.captchaError = CAP_ERROR
        return Promise.reject(Error('error'))
      }
      this.captchaError = ''
      return Promise.resolve()
    },
    async handleCaptchTap() {
      if (this.captchaDisabled) {
        return;
      }
      this.captchaDisabled = true;
      const res = await sendSmsVerifyCode({
        input: {
          mobile: this.phone,
          messageAction: 'SMS_BIND_MOBILE',
        },
      });
      this.verifyToken = get(res, 'data.sendSmsVerifyCode')
      this.captchaSending = true;
      uni.showToast({
        title: '验证码已发送，注意查收',
        icon: 'none',
      });
      this.seconds = 60;
      const timer = setInterval(() => {
        this.seconds--;
        if (this.seconds === 0) {
          this.captchaSending = false;
          this.captchaDisabled = false;
          clearInterval(timer);
        }
      }, 1000);
    },
    async handleBindMobile() {
      return new Promise((resolve, reject) => {
        if (!this.isFulledPhone && this.captcha && this.captchaError) {
          resolve()
        } else if (!this.bindParams || Object.keys(this.bindParams).length === 0 || !this.isFulledPhone) {
          reject(Error('绑定失败'))
        } else {
          this.bindMobileByEncryptedData(this.bindParams).then((bindRes) => {
            const errorCode = get(bindRes, 'errors[0].code')
            const errorMsg = getErrorMessage(errorCode, get(bindRes, 'errors[0].message'))
            if (!(get(bindRes, 'data.bindMobileByEncryptedData') || true) || errorCode) {
              uni.showToast({
                title: errorMsg,
                icon: 'none',
              });
              reject(Error(errorMsg))
            } else {
              resolve()
            }
          }).catch((error) => {
            console.error('绑定失败', error)
            reject(Error('绑定失败'))
          })
        }
      })
    },
    async getValidate() {
      return new Promise((resolve, reject) => {
        let isError = ''
        if ((!this.phone || this.phone.length === 0) || (this.phone && !utils.isPhone(this.phone))) {
          this.isPhoneError = true
          isError = '手机错误'
        }
        if ((!this.isFulledPhone && (this.captcha.length !== 6 || !this.captcha))) {
          this.captchaError = CAP_ERROR
          isError = '验证码错误'
        }
        if (isError) {
          reject(Error(isError))
        } else {
          resolve({
            phone: this.phone,
            captcha: this.captcha,
          })
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.phone-fulled {
  text {
    display: block;
  }

  text + text {
    margin-top: 8rpx;
    font-size: 19rpx;
  }
  .phone-number {
    margin-top: 7rpx;
  }
}
</style>
