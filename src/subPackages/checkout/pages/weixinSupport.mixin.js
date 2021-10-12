import { mapActions, mapGetters } from 'vuex';
import { get } from '@/utils/utilityOperationHelper';

const INIT_REGION = {
  name: '',
  code: '',
}
export default {
  data() {
    return {
      cityList: [],
      areaList: [],
      province: { ...INIT_REGION },
      city: { ...INIT_REGION },
      area: { ...INIT_REGION },
      address: '',
      receiverName: '',
      receiverPhone: '',
      addressObj: null,
      personalInvoiceInfo: {},
      companyInvoiceInfo: {},
      personalInvoiceCheckd: true,
    }
  },
  methods: {
    ...mapActions('order', ['getRegionsList']),
    ...mapActions('user', ['deliveryAddressCreateApi']),
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
    handleAuthInvoice() {
      uni.showLoading({
        title: '加载中...',
      });
      uni.getSetting({
        success: (res) => {
          uni.hideLoading();
          const getSetting = res.authSetting;
          if (getSetting['scope.invoiceTitle'] === undefined) {
            // 用户没有授权过地址
            this.handleChooseInvoice();
          } else if (getSetting['scope.invoiceTitle'] === false) {
            // 用户拒绝过授权
            uni.openSetting({
              // 到期微信端设置界面
              success: (response) => {
                const openSetting = response.authSetting;
                if (openSetting['scope.invoiceTitle'] === true) {
                  // 用户在设置中同意获取收货地址
                  this.handleChooseInvoice();
                }
              },
            });
          } else if (getSetting['scope.invoiceTitle'] === true) {
            // 用户同意获取用户授权
            this.handleChooseInvoice();
          }
        },
      });
    },
    handleChooseInvoice() {
      uni.chooseInvoiceTitle({
        success: (res) => {
          console.log(res)
          if (res.type === '0') {
            this.companyInvoiceInfo = res
            this.personalInvoiceCheckd = false
          } else {
            this.personalInvoiceInfo = res
            this.personalInvoiceCheckd = true
            console.log(this.personalInvoiceCheckd, this.personalInvoiceInfo)
          }
        },
      })
    },
    handleWxAddress() {
      uni.chooseAddress({
        success: (res) => {
          console.log(res)
          if (
            res.provinceName === '台湾省'
            || res.provinceName === '香港特别行政区'
            || res.provinceName === '澳门特别行政区'
          ) {
            uni.showToast({
              title: '不支持港澳台地区！',
              icon: 'none',
            })
            return
          }
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
          const cityIndex = this.cityList.findIndex((item) => item.name === res.cityName);
          const city = this.cityList[cityIndex] || {};
          this.city = { name: city.name || '', code: city.code || '' };
          this.handleCityChange({
            detail: {
              value: cityIndex,
            },
          });
          const area = this.areaList.find((item) => item.name === res.countyName) || {};
          this.area = { name: area.name || '', code: area.code || '' };

          this.receiverName = res.userName;
          this.address = res.detailInfo;
          this.wxAddressAdd(res)
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
    async wxAddressAdd(res) {
      const params = {
        receiverName: res.userName,
        receiverMobile: res.telNumber,
        country: '中国',
        provinceId: this.province.code,
        province: this.province.name,
        cityId: this.city.code,
        city: this.city.name,
        districtId: this.area.code,
        district: this.area.name,
        address: res.detailInfo,
        isDefault: false,
      }
      console.log('params', params)
      try {
        const add = await this.deliveryAddressCreateApi(params);
        this.setAddressInfo({
          ...params,
          code: get(add, 'data.deliveryAddressCreate.code'),
          addressVerify: get(add, 'data.deliveryAddressCreate.addressVerify'),
        })
        console.log('add', add)
      } catch (err) {
        console.log(err);
        // this.showMessage(err);
      }
    },
  },
  computed: {
    ...mapGetters('order', ['regionsList']),
  },
};
