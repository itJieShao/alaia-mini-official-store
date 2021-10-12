<template>
  <view class="checkout-invoice">
    <view class="title">电子发票</view>
    <view class="invoice-need">
      <c-checkbox v-model="notNeed" @change="handleNeedChange('notNeed')">
        <text>不需要</text>
      </c-checkbox>
      <c-checkbox class="checkbox-need" v-model="need" @change="handleNeedChange('need')">
        <text>需要</text>
      </c-checkbox>
    </view>
    <view v-show="need">
      <view class="isNeed-invoice">
        <view class="need-content">我们将在您确认收货7天后，将电子发票发送至您下方预留的电子邮箱和手机中。如有任何疑问，请联系在线客服或致电：{{ SERVICE_TEL }}</view>
      </view>
      <view class="type">
        <view class="item">
          <c-checkbox v-model="self" @change="handleTypeChange('self')">
            <text class="item-text">个人</text>
          </c-checkbox>
        </view>
        <view class="item">
          <c-checkbox v-model="company" @change="handleTypeChange('company')">
            <text class="item-text">公司</text>
          </c-checkbox>
          <view v-show="company" class="getInvoice" @tap="handleInvoiceTap">授权发票信息</view>
        </view>
      </view>
      <view v-show="self" class="self-invoice">
        <view class="form-item">
          <view class="form-title">电子邮箱*</view>
          <view class="form-content">
            <input v-model.trim="selfMail" @input="handleInput('isSelfMailError')" />
          </view>
          <view v-show="isSelfMailError" class="form-error">{{selfMailErrorMsg}}</view>
        </view>
        <view class="form-item">
          <view class="form-title">手机号码*</view>
          <view class="form-content">
            <input v-model.trim="selfPhone" @input="handleInput('isSelfPhoneError')" />
            <button class="getPhone" open-type="getPhoneNumber"
              @getphonenumber="handleGetSelfPhoneNumber">授权手机号码</button>
          </view>
          <view v-show="isSelfPhoneError" class="form-error">{{selfPhoneErrorMsg}}</view>
        </view>
      </view>
      <view v-show="company" class="company-invoice">
        <view class="form-item">
          <view class="form-title">公司名称*</view>
          <view class="form-content">
            <input v-model.trim="companyName" maxlength="250" @input="handleInput('isCompanyNameError')" />
          </view>
          <view v-show="isCompanyNameError" class="form-error">{{ companyNameErrorMsg }}</view>
        </view>
        <view class="form-item">
          <view class="form-title">纳税人识别号*</view>
          <view class="form-content">
            <input v-model.trim="companyCode" @input="handleInput('isCompanyCodeError')" />
          </view>
          <view v-show="isCompanyCodeError" class="form-error">{{companyCodeErrorMsg}}</view>
        </view>
        <view class="form-item">
          <view class="form-title">电子邮箱*</view>
          <view class="form-content">
            <input v-model.trim="companyMail" @input="handleInput('isCompanyMailError')" />
          </view>
          <view v-show="isCompanyMailError" class="form-error">{{companyMailErrorMsg}}</view>
        </view>
        <view class="form-item">
          <view class="form-title">手机号码*</view>
          <view class="form-content">
            <input v-model.trim="companyPhone" @input="handleInput('isCompanyPhoneError')" />
            <button class="getPhone" open-type="getPhoneNumber"
              @getphonenumber="handleGetCompanyPhoneNumber">授权手机号码</button>
          </view>
          <view v-show="isCompanyPhoneError" class="form-error">{{companyPhoneErrorMsg}}</view>
        </view>
      </view>
    </view>
    <button :class="['btn-save', {'no-need': notNeed}]" @tap="handleSaveTap">保存</button>
  </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CCheckbox from '../../subPackages/checkout/components/CCheckbox';
import utils from '../../utils/utils';
import { get } from '../../utils/utilityOperationHelper';
import { decryptData } from '../../service/apis/account';
import {
  INVOICE_TITLE_TYPE, INVOICE_DISTRIBUTION_TYPE, INVOICE_CARRIER, INVOICE_TYPE,
} from '../../constants/order'
import { trackerCommonPageView, SCREEN_NAME } from '../../utils/ga';
import { SERVICE_TEL } from '../../constants/user'

export default {
  components: {
    CCheckbox,
  },
  data() {
    return {
      SERVICE_TEL,
      notNeed: true,
      need: false,
      self: true,
      company: false,
      selfMail: '',
      selfPhone: '',
      companyName: '',
      companyCode: '',
      companyMail: '',
      companyPhone: '',
      isSelfMailError: false,
      isSelfPhoneError: false,
      isCompanyNameError: false,
      isCompanyCodeError: false,
      isCompanyMailError: false,
      isCompanyPhoneError: false,
      selfMailErrorMsg: '请输入电子邮箱',
      selfPhoneErrorMsg: '请输入手机号',
      companyCodeErrorMsg: '请输入15、17、18或20位纳税人识别号',
      companyMailErrorMsg: '请输入电子邮箱',
      companyPhoneErrorMsg: '请输入手机号',
      companyNameErrorMsg: '请输入公司名称',
      // 订单编号, 补开发票
      orderCode: null,
    };
  },
  computed: {
    ...mapGetters('order', ['invoiceInfo']),
  },
  watch: {
    invoiceInfo: {
      handler(newVal) {
        this.need = newVal.isNeed
        this.notNeed = !newVal.isNeed
        const isCompany = newVal.titleType === INVOICE_TITLE_TYPE.COMPANY
        this.company = isCompany
        this.self = !isCompany
        if (isCompany) {
          this.companyMail = get(newVal, 'recipient.mail')
          this.companyPhone = get(newVal, 'recipient.mobile')
          this.companyName = get(newVal, 'title')
          this.companyCode = get(newVal, 'taxNo')
        } else {
          this.selfMail = get(newVal, 'recipient.mail')
          this.selfPhone = get(newVal, 'recipient.mobile')
        }
      },
      immediate: true,
      deep: true,
    },
  },
  onLoad({ orderCode }) {
    this.orderCode = orderCode
  },
  onShow() {
    trackerCommonPageView(SCREEN_NAME.INVOICE)
  },
  methods: {
    ...mapActions('order', ['setInvoiceInfo']),
    handleNeedChange(type) {
      if (type === 'need') {
        this.notNeed = !this.need;
      } else {
        this.need = !this.notNeed;
      }
    },
    handleTypeChange(type) {
      if (type === 'self') {
        this.company = !this.self;
      } else {
        this.self = !this.company;
      }
    },
    handleInput(erorrProp) {
      this[erorrProp] = false;
    },
    handleInvoiceTap() {
      const that = this;
      uni.chooseInvoiceTitle({
        success(res) {
          console.log(res);
          if (res.type === '1') {
            // 个人
            that.self = true;
            that.company = false;
          } else {
            that.companyName = res.title;
            that.isCompanyNameError = false;
            that.companyCode = res.taxNumber;
            that.isCompanyCodeError = false;
          }
        },
        fail() {
          uni.showToast({
            title: '获取失败，请稍后再试',
            icon: 'none',
            duration: 2000,
          });
        },
      });
    },
    handleGetSelfPhoneNumber(e) {
      this.handleGetPhoneNumber(e, 'self');
    },
    handleGetCompanyPhoneNumber(e) {
      this.handleGetPhoneNumber(e, 'company');
    },
    async handleGetPhoneNumber(e, type) {
      if (get(e, 'detail.errMsg') === 'getPhoneNumber:ok') {
        const { detail } = e;
        if (detail.encryptedData && detail.iv) {
          const params = {
            encryptedData: detail.encryptedData,
            iv: detail.iv,
          };
          let phoneNumber = ''
          try {
            const result = await decryptData(params);
            phoneNumber = get(JSON.parse(get(result, 'data.decryptData')), 'phoneNumber');
          } catch (e) {
            console.log('解析失败', e)
          }
          if (type === 'self') {
            this.selfPhone = phoneNumber;
            this.isSelfPhoneError = false;
          } else {
            this.companyPhone = phoneNumber;
            this.isCompanyPhoneError = false;
          }
        }
      } else {
        uni.showToast({
          title: '授权失败 请再次授权',
          icon: 'none',
        })
      }
    },
    handleSaveTap() {
      if (this.notNeed) {
        this.setInvoiceInfo(null)
        uni.navigateBack();
        return;
      }
      let params = {
        isNeed: true,
        carrier: INVOICE_CARRIER,
        type: INVOICE_TYPE,
      }
      if (this.self) {
        if (!this.selfMail) {
          this.selfMailErrorMsg = '请输入电子邮箱';
          this.isSelfMailError = true;
        }
        if (!this.selfPhone) {
          this.selfPhoneErrorMsg = '请输入手机号';
          this.isSelfPhoneError = true;
        }
        if (this.selfMail && !utils.isEmail(this.selfMail)) {
          this.selfMailErrorMsg = '请输入正确的邮箱';
          this.isSelfMailError = true;
        }
        if (this.selfPhone && !utils.isPhone(this.selfPhone)) {
          this.selfPhoneErrorMsg = '请输入正确的手机号';
          this.isSelfPhoneError = true;
        }
        if (this.isSelfMailError || this.isSelfPhoneError) {
          return;
        }
        params = {
          ...params,
          ...{
            titleType: INVOICE_TITLE_TYPE.PERSONAL, // 个人
            recipient: {
              mobile: this.selfPhone,
              mail: this.selfMail,
              distributionType: INVOICE_DISTRIBUTION_TYPE,
            },
          },
        }
      } else {
        if (!this.companyName) {
          this.isCompanyNameError = true;
          this.companyNameErrorMsg = '请输入公司名称'
        }
        if (this.companyName && (utils.checkEmoji(this.companyName) || utils.checkSpecialCharacter(this.companyName))) {
          this.isCompanyNameError = true;
          this.companyNameErrorMsg = '您的公司名称输入有误'
        }
        if (!this.companyMail) {
          this.companyMailErrorMsg = '请输入电子邮箱';
          this.isCompanyMailError = true;
        }
        if (!this.companyPhone) {
          this.companyPhoneErrorMsg = '请输入手机号';
          this.isCompanyPhoneError = true;
        }
        if (!this.companyCode) {
          this.companyCodeErrorMsg = '请输入纳税人识别号';
          this.isCompanyCodeError = true;
        }
        if (this.companyCode && !utils.isInvoiceNumber(this.companyCode)) {
          this.companyCodeErrorMsg = '请输入15、17、18或20位纳税人识别号';
          this.isCompanyCodeError = true;
        }
        if (this.companyMail && !utils.isEmail(this.companyMail)) {
          this.companyMailErrorMsg = '请输入正确的邮箱';
          this.isCompanyMailError = true;
        }

        if (this.companyPhone && !utils.isPhone(this.companyPhone)) {
          this.companyPhoneErrorMsg = '请输入正确的手机号';
          this.isCompanyPhoneError = true;
        }
        if (this.isCompanyNameError || this.isCompanyMailError || this.isCompanyPhoneError || this.isCompanyCodeError) {
          return;
        }
        params = {
          ...params,
          ...{
            titleType: INVOICE_TITLE_TYPE.COMPANY,
            title: this.companyName,
            taxNo: this.companyCode,
            recipient: {
              mobile: this.companyPhone,
              mail: this.companyMail,
              distributionType: INVOICE_DISTRIBUTION_TYPE,
            },
          },
        }
      }
      // 如果是补开发票
      if (this.orderCode) {
        params.orderCode = this.orderCode
      }
      this.setInvoiceInfo(params)
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss">
.checkout-invoice {
  position: relative;
  min-height: 100vh;
  padding: 25rpx;

  .title {
    font-size: 44rpx;
    color: #fff;
    text-align: center;
    line-height: 100rpx;
  }

  .invoice-need {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 100rpx;
    text {
      padding: 0 30rpx;
      color: #fff;
      font-size: 24rpx;
    }
    .checkbox-need {
      margin-left: 90rpx;
    }
  }

  .isNeed-invoice {
    margin-top: 20rpx;

    .need-content {
      font-size: 26rpx;
      color: #ccc;
      letter-spacing: 2rpx;
      line-height: 40rpx;
      margin-bottom: 18rpx;
    }
  }

  .type {
    .item {
      position: relative;
      display: flex;
      margin-bottom: 40rpx;

      text {
        margin-left: 30rpx;
        color: #fff;
        font-size: 24rpx;
      }
    }
  }

  .form-item {
    display: flex;
    flex-wrap: wrap;
    margin-top: 38rpx;

    .form-title {
      padding-right: 20rpx;
      font-size: 26rpx;
      color: #ccc;
      height: 60rpx;
      line-height: 60rpx;
      border-bottom: 1px solid #444;
    }

    .form-content {
      flex: 1;
      display: flex;
      height: 60rpx;
      border-bottom: 1px solid #444;

      input {
        width: calc(100% - 180rpx);
        height: 100%;
        color: #ccc;
        font-size: 24rpx;
      }
    }

    .form-error {
      padding: 8rpx 0;
      width: 100%;
      font-size: 22rpx;
      color: #f00;
    }
  }

  .getPhone {
    width: 180rpx;
    height: 50rpx;
    font-size: 24rpx;
    line-height: 50rpx;
    border: 1px solid #fff;
    color: #fff;
    border-radius: 4rpx;
    letter-spacing: -1rpx;
    background: transparent;
  }

  .getInvoice {
    position: absolute;
    bottom: -10rpx;
    right: 14rpx;
    width: 180rpx;
    height: 50rpx;
    text-align: center;
    line-height: 50rpx;
    border: 1px solid #fff;
    font-size: 24rpx;
    color: #fff;
    border-radius: 4rpx;
  }

  .btn-save {
    display: block;
    width: 150rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    background-color: #2f3335;
    border: 1px solid #fff;
    border-radius: 10rpx;
    margin: 100rpx auto;
    color: #fff;
    &.no-need {
      margin: 0;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
