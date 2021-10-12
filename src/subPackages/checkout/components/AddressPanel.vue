<template>
  <panel>
    <panel-title title="收货信息" @panelTitleTap="handleTitleTap" :isOpen="true"></panel-title>
    <panel-content :show="showContent">
      <button class="btn-auth-addr" @tap="handleAuthAddr">一键地址授权</button>
      <form-item>
        <form-title>收件人*</form-title>
        <form-content>
          <form-input v-model="receiverName" @input="handleReceiverName"></form-input>
        </form-content>
        <form-error v-show="isReceiverError">*请输入收货人姓名</form-error>
        <form-error v-show="isReceiverInputError">*您的收货人姓名输入有误</form-error>
      </form-item>
      <view class="phone-number">
        <form-item>
          <form-title>手机号码*</form-title>
          <form-content v-show="!isReceiver">
            <form-input v-model="receiverPhone" @input="handleReceiverPhone"></form-input>
          </form-content>
          <form-error v-show="isReceiverPhoneError">*请正确输入收货人手机号</form-error>
        </form-item>
      </view>
      <view class="check-content">
        <c-checkbox v-model="isReceiver" @change="handleReceiverChange"></c-checkbox>
        <text>收货手机号码与注册手机号码一致</text>
      </view>
      <view class="picker-area">
        <form-item>
          <form-title>省*</form-title>
          <form-content>
            <p-picker class="ppicker" v-model="province" :range="regionsList" placeholder="请选择省份"
              @change="handleProvinceChange">
            </p-picker>
          </form-content>
        </form-item>
        <form-item>
          <form-title>市*</form-title>
          <form-content>
            <p-picker class="ppicker" v-model="city" :range="cityList" placeholder="请选择城市" @change="handleCityChange">
            </p-picker>
          </form-content>
        </form-item>
        <form-item>
          <form-title>区*</form-title>
          <form-content>
            <p-picker class="ppicker" v-model="area" :range="areaList" placeholder="请选择地区" @change="handleAreaChange">
            </p-picker>
          </form-content>
        </form-item>
      </view>
      <form-error v-show="isAreaError">*请选择完整的所在地</form-error>
      <view class="address-content">
        <form-item>
          <form-title>详细地址*</form-title>
          <form-content>
            <form-textarea :height="130" placeholder="请输入您的详细地址" v-model="address" @input="handleAddress"></form-textarea>
          </form-content>
          <form-error v-show="isAddressError">*请填写收货人详细地址</form-error>
          <form-error v-show="isAddressInputError">*您的收货人详细地址输入有误</form-error>
        </form-item>
      </view>
    </panel-content>
  </panel>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Panel from '../../../components/panel';
import PanelTitle from '../../../components/panelTitle';
import PanelContent from '../../../components/panelContent';
import FormItem from './FormItem';
import FormTitle from './FormTitle';
import FormContent from './FormContent';
import FormInput from './FormInput';
import FormError from './FormError';
import CCheckbox from './CCheckbox';
import PPicker from './PPicker';
import FormTextarea from './FormTextarea';
import util from '../../../utils/utils.js';
import { get, isEmpty } from '../../../utils/utilityOperationHelper';

const INIT_REGION = {
  name: '',
  code: '',
}
export default {
  name: 'AddressPanel',
  components: {
    Panel,
    PanelTitle,
    PanelContent,
    FormItem,
    FormTitle,
    FormContent,
    FormInput,
    FormError,
    CCheckbox,
    PPicker,
    FormTextarea,
  },
  data() {
    return {
      showContent: true,
      receiverName: '',
      receiverPhone: '',
      isReceiverError: false,
      isReceiverInputError: false,
      isReceiverPhoneError: false,
      isReceiver: true,
      isAreaError: false,
      isAddressError: false,
      isAddressInputError: false,
      cityList: [],
      areaList: [],
      province: { ...INIT_REGION },
      city: { ...INIT_REGION },
      area: { ...INIT_REGION },
      address: '',
    };
  },
  computed: {
    ...mapGetters('order', ['regionsList']),
  },
  created() {
    this.getRegionsList()
  },
  methods: {
    ...mapActions('order', ['getRegionsList']),
    handleTitleTap() {
      this.showContent = !this.showContent;
    },
    handleAuthAddr() {
      uni.showLoading({
        title: '加载中...',
      });
      uni.getSetting({
        success: (res) => {
          uni.hideLoading();
          const getSetting = res.authSetting;
          if (getSetting['scope.address'] === undefined) {
            // 用户没有授权过地址
            this.handleWxAddress();
          } else if (getSetting['scope.address'] === false) {
            // 用户拒绝过授权
            uni.openSetting({
              // 到期微信端设置界面
              success: (response) => {
                const openSetting = response.authSetting;
                if (openSetting['scope.address'] === true) {
                  // 用户在设置中同意获取收货地址
                  this.handleWxAddress();
                }
              },
            });
          } else if (getSetting['scope.address'] === true) {
            // 用户同意获取用户授权
            this.handleWxAddress();
          }
        },
      });
    },
    handleWxAddress() {
      uni.chooseAddress({
        success: (res) => {
          const provinceIndex = this.regionsList.findIndex(
            (item) => item.name === get(res, 'provinceName'),
          );
          const province = this.regionsList[provinceIndex] || {};
          this.province = { name: province.name || '', code: province.code || '' };
          this.handleProvinceChange({
            detail: {
              value: provinceIndex,
            },
          });
          const cityIndex = this.cityList.findIndex(
            (item) => item.name === res.cityName,
          );
          const city = this.cityList[cityIndex] || {};
          this.city = { name: city.name || '', code: city.code || '' };
          this.handleCityChange({
            detail: {
              value: cityIndex,
            },
          });
          const area = this.areaList.find(
            (item) => item.name === res.countyName,
          ) || {};
          this.area = { name: area.name || '', code: area.code || '' };

          this.receiverName = res.userName;
          this.address = res.detailInfo;
          // 初始化错误信息
          this.isReceiverError = false;
          this.isReceiverInputError = false;
          this.isAreaError = false
          this.isAddressError = false
          this.isAddressInputError = false
        },
      });
    },
    handleProvinceChange(e) {
      const index = parseInt(get(e, 'detail.value'));
      this.$emit('changeProvince', this.regionsList[index])
      this.cityList = get(this.regionsList[index], 'children')
      this.city = { ...INIT_REGION }
      this.area = { ...INIT_REGION }
      this.handleCityChange({
        detail: {
          value: 0,
        },
      });
    },
    handleCityChange(e) {
      const index = parseInt(get(e, 'detail.value'));
      this.areaList = get(this.cityList[index], 'children')
      this.area = { ...INIT_REGION }
      this.isAreaError = false
    },
    handleAreaChange() {
      if (!this.checkRegionNull(this.area)) {
        this.isAreaError = false
      }
    },
    handleReceiverName() {
      if (this.checkSpecialInput(this.receiverName)) {
        this.isReceiverInputError = true;
        this.isReceiverError = false;
        return
      }
      this.isReceiverInputError = false;
      this.isReceiverError = false
    },
    handleReceiverPhone() {
      if (util.isPhone(this.receiverPhone)) {
        this.isReceiverPhoneError = false
      } else {
        this.isReceiverPhoneError = true
      }
    },
    handleAddress() {
      if (this.checkSpecialInput(this.address)) {
        this.isAddressError = false
        this.isAddressInputError = true
        return
      }
      this.isAddressError = false
      this.isAddressInputError = false
    },
    handleReceiverChange() {
      this.isReceiverPhoneError = false
    },
    checkSpecialInput(str) {
      if (!str) return false
      return util.checkSpecialCharacter(str) || util.checkEmoji(str)
    },
    getValidate() {
      return new Promise((resolve, reject) => {
        let isError = false
        if (!this.receiverName || isEmpty(this.receiverName)) {
          this.isReceiverError = true
          this.isReceiverInputError = false
          isError = '收件人姓名'
        }
        if (this.checkSpecialInput(this.receiverName)) {
          this.isReceiverError = false
          this.isReceiverInputError = true
          isError = '收件人姓名'
        }
        if (!this.isReceiver) {
          if (!this.receiverPhone || !util.isPhone(this.receiverPhone)) {
            this.isReceiverPhoneError = true
            isError = '收件人手机号码'
          }
        }
        if (this.checkRegionNull(this.province) || this.checkRegionNull(this.city) || this.checkRegionNull(this.area)) {
          this.isAreaError = true
          isError = '区域选择'
        }
        if (!this.address || isEmpty(this.address)) {
          this.isAddressError = true;
          this.isAddressInputError = false
          isError = '收货人地址'
        }
        if (this.checkSpecialInput(this.address)) {
          this.isAddressError = false;
          this.isAddressInputError = true
          isError = '收货人地址'
        }

        if (isError && isError.length > 0) {
          reject(Error(isError))
        } else {
          const params = {
            address: this.address,
            country: '中国',
            province: get(this.province, 'name'),
            provinceId: parseInt(get(this.province, 'code')),
            city: get(this.city, 'name'),
            cityId: parseInt(get(this.city, 'code')),
            district: get(this.area, 'name'),
            districtId: parseInt(get(this.area, 'code')),
            mobile: this.isReceiver ? '' : this.receiverPhone,
            name: this.receiverName,
          }
          resolve({ ...params })
        }
      })
    },
    checkRegionNull(obj) {
      if (!obj || Object.keys(obj) === 0) return true
      if ((!obj.name && !obj.code) || !obj.name) return true
      return false
    },
  },
};
</script>

<style lang="scss" scoped>

.btn-auth-addr {
  display: block;
  height: 72rpx;
  line-height: 72rpx;
  width: 670rpx;
  border: 1px solid #fff;
  border-radius: 4rpx;
  font-size: 24rpx;
  color: #fff;
  margin: 52rpx 0 36rpx 0;
  background-color: #2f3335;
}
.check-content {
  display: flex;
  align-items: center;
  margin-top: -14rpx;
  padding: 58rpx 0;

  text {
    margin-left: 15rpx;
  }
}

.picker-area {
  padding-top: 19rpx;
  display: flex;
  justify-content: space-between;
  border-top: 1rpx solid #4e5153;

  .ppicker {
    margin-top: 16rpx;
  }
}
.address-content {
  margin-bottom: 20rpx;
}
.phone-number {
  margin-top: 34rpx;
}
</style>
