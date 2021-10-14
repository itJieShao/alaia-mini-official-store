<template>
  <view class="address-container">
    <custom-nav-bar :head-font-color="false" />
    <view :style="{'padding-top':ktxStatusHeight}">
      <view class="list" v-if="addressList.length">
        <view class="item-box" v-for="(item,index) in addressList" :key="index">
          <view class="item">
            <view class="item-name">
              <text>{{item.node.receiverName}}</text>
              <text v-if="item.node.isDefault">[默认]</text>
            </view>
            <text class="item-phone">{{item.node.receiverMobile}}</text>
            <text class="item-address">
              {{item.node.province}}{{item.node.city}}{{item.node.district}}{{item.node.address}}
            </text>
            <view class="item-btn" v-if="!code">
              <text @click="goEditPage(item.node.code)">编辑</text>
              <text @click="deleteAddress(item.node.code)">移除</text>
            </view>
          </view>
        </view>
        <view style="margin-top: 80rpx;">
          <customButton :btnWidth="690" className="big-btn" @click="goNextPage('/subPackages/address/pages/add/index')">
            添加新地址</customButton>
        </view>
      </view>
      <view class="no-list" v-if="!isLoading && !addressList.length">
        <text class="empty">地址簿为空</text>
        <text class="tip-text">请添加您的新地址，以便收取您心爱的商品</text>
        <view style="margin-top: 100rpx;">
          <customButton :btnWidth="340" className="big-btn" @click="goNextPage('/subPackages/address/pages/add/index')">
            添加新地址</customButton>
        </view>
      </view>

      <view class="use-wechat" @tap="handleAuthAddr">
        <text class="icon-font icon-icon-weixin"></text>
        使用微信地址
      </view>
    </view>
  </view>
</template>

<script>
  import customButton from '@/components/al-button/normal.vue'
  import {
    mapActions,
    mapGetters
  } from 'vuex';
  import {
    get
  } from '@/utils/utilityOperationHelper';
  import zCheckbox from '@/components/checkbox';

  const INIT_REGION = {
    name: '',
    code: '',
  }
  export default {
    name: 'addressList',
    components: {
      zCheckbox,
      customButton
    },
    data() {
      return {
        addressList: [],
        cityList: [],
        areaList: [],
        province: {},
        city: {},
        area: {},
        source: '',
        code: '',
        ktxStatusHeight: getApp().globalData.ktxStatusHeight,
        isAddress: true,
        isLoading:false,
      }
    },
    computed: {
      ...mapGetters('order', ['regionsList']),
    },
    onShow() {
      this.getDeliveryAddresses()
      this.getRegionsList()
    },
    onLoad(option) {
      this.source = option.source;
      this.code = option.code;
    },
    onPullDownRefresh() {
      wx.stopPullDownRefresh(); // 阻止下拉刷新
    },
    methods: {
      ...mapActions('user', ['deliveryAddressesApi', 'removeAddressApi', 'deliveryAddressCreateApi']),
      ...mapActions('order', ['getRegionsList', 'setAddressInfo']),
      // 获取收货地址列表
      async getDeliveryAddresses() {
        this.isLoading = true;
        if (this.isAddress) {
          uni.showLoading({
            title: '加载中...',
          })
        }
        try {
          const list = await this.deliveryAddressesApi({
            size: 1000,
            page: 1
          });
          this.isLoading = false;
          if (this.isAddress) {
            uni.hideLoading()
            this.isAddress = false
          }
          const initList = list.data.customer.deliveryAddresses.edges
          if (this.source == 'checkoutPage' && this.code) {
            const filterList = initList.map((item) => {
              if (item.node.code == this.code) {
                return {
                  ...item.node,
                  isSelect: true
                }
              }
              return {
                ...item.node,
                isSelect: false
              }
            })
            this.addressList = filterList.map((item) => ({
              node: item
            }))
          } else {
            this.addressList = initList
          }
        } catch (err) {
          uni.hideLoading()
          console.log(err);
          this.showMessage(err);
        }
      },
      // 如果用户对选中的地址进行编辑， 则需要同步更新后的数据到checkout页面
      goEditPage(code) {
        const url = `/subPackages/address/pages/add/index?code=${code}`
        uni.navigateTo({
          url,
        })
      },
      // 删除收获地址
      async deleteAddress(code) {
        uni.showLoading({
          title: '加载中...',
        });
        try {
          const deleteResult = await this.removeAddressApi(code);
          console.log('deleteResult', deleteResult)
          if (deleteResult.data.deliveryAddressDelete) {
            uni.hideLoading();
            this.getDeliveryAddresses()
            setTimeout(() => {
              uni.showToast({
                title: '地址移除成功',
                icon: 'none',
              })
            }, 200);
          } else {
            uni.hideLoading();
            setTimeout(() => {
              uni.showToast({
                title: '地址移除失败',
                icon: 'none',
              })
            }, 200);
          }
        } catch (err) {
          console.log(err);
          uni.hideLoading();
          this.showMessage(err);
        }
      },
      // 使用微信地址
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
      // 用户同意使用微信地址
      handleWxAddress() {
        uni.chooseAddress({
          success: (res) => {
            console.log('weixin', res)
            if (res.provinceName == '台湾省' || res.provinceName == '香港特别行政区' || res.provinceName == '澳门特别行政区') {
              setTimeout(() => {
                uni.showToast({
                  title: '不支持港澳台地区！',
                  icon: 'none',
                })
              }, 200);
              return
            }
            const provinceIndex = this.regionsList.findIndex(
              (item) => item.name === get(res, 'provinceName'),
            );
            const province = this.regionsList[provinceIndex] || {};
            this.handleProvinceChange({
              detail: {
                value: provinceIndex,
              },
            });
            this.province = {
              name: province.name || '',
              code: province.code || ''
            };
            const cityIndex = this.cityList.findIndex(
              (item) => item.name === res.cityName,
            );
            const city = this.cityList[cityIndex] || {};
            this.handleCityChange({
              detail: {
                value: cityIndex,
              },
            });
            this.city = {
              name: city.name || '',
              code: city.code || ''
            };
            const area = this.areaList.find(
              (item) => item.name === res.countyName,
            ) || {};
            this.area = {
              name: area.name || '',
              code: area.code || ''
            };
            this.wxAddressAdd(res)
          },
        });
      },
      // 添加微信地址
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
          console.log('add', add)
          this.getDeliveryAddresses()
          setTimeout(() => {
            uni.showToast({
              title: '添加成功！',
              icon: 'none',
            })
          }, 200);
        } catch (err) {
          console.log(err);
          this.showMessage(err);
        }
      },
      // 省份改变
      handleProvinceChange(e) {
        const index = parseInt(get(e, 'detail.value'));
        this.cityList = get(this.regionsList[index], 'children')
        this.city = {
          ...INIT_REGION
        }
        this.area = {
          ...INIT_REGION
        }
        this.handleCityChange({
          detail: {
            value: 0,
          },
        });
      },
      // 城市改变
      handleCityChange(e) {
        const index = parseInt(get(e, 'detail.value'));
        this.areaList = get(this.cityList[index], 'children')
        this.area = {
          ...INIT_REGION
        }
      },
      // 选中
      checkboxChange(item) {
        if (this.code) {
          this.setAddressInfo(item.node)
          const {
            code
          } = item.node
          const list = this.addressList.map((item) => {
            if (item.node.code == code) {
              return {
                ...item.node,
                isSelect: true
              }
            }
            return {
              ...item.node,
              isSelect: false
            }
          })
          this.addressList = list.map((item) => ({
            node: item
          }))
          console.log('list', list)
          uni.navigateBack();
        }
      },
      // 跳转到下一页
      goNextPage(url) {
        console.log(url);
        uni.navigateTo({
          url,
        })
      },
      showMessage(msg) {
        if (msg) {
          uni.showToast({
            title: msg,
            icon: 'none',
          });
        } else {
          uni.showToast({
            title: '系统异常',
            icon: 'none',
          });
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
