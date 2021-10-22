<template>
  <view class="store-list">
    <custom-nav-bar title="精品店" :head-font-color="false"  />
    <view :style="{'padding-top':ktxStatusHeight}"></view>
    <!-- 精品店列表 -->
    <image class="banner" src="https://scm-dam.oss-cn-shanghai.aliyuncs.com/scm-dam/2021-10-22/0.5941669535944558%E7%B2%BE%E5%93%81%E5%BA%97.jpg"
     mode="aspectFill" :lazy-load="true"></image>
    <view class="store-list-box" v-if="isLoad && storeList.length > 0">
      <view class="store-list-item" v-for="(storeItem,storeIndex) in storeList" :key="storeIndex">
        <!-- 店名 -->
        <view class="store-name">
          <view class="name">{{storeItem.locationName}}</view>
          <!-- 距离 -->
          <view class="store-distance">
            <view v-if="storeItem.distance" @click="toMap(storeItem)">
              <text class="icon-font icon-fangwei"></text>
              <text class="distance">{{storeItem.distance}}km</text>
            </view>
            <!-- <view class="distance" v-else>暂无</view> -->
          </view>
        </view>
        <!-- 地址 -->
        <view class="store-info store-address">
          <!-- <text class="icon-font icon-icon-dingwei"></text> -->
          <text class="info">{{storeItem.address || '暂无地址'}}</text>
        </view>
        <!-- 电话 -->
        <view class="store-info" style="margin-bottom: 0 !important;">
          <!-- <text class="icon-font icon-icon-dianhua"></text> -->
          <view class="info">
            <text>服务热线</text>
            <text v-if="storeItem.phone" class="phonenum back-font" @click="handleMakePhoneCall(storeItem.phone)">
              {{storeItem.phone}}
            </text>
            <text class="back-font" v-else>暂无电话</text>
          </view>
        </view>
        <!-- 营业时间 -->
        <view class="store-info">
          <!-- <text class="icon-font icon-icon-yuyue"></text> -->
          <view class="info">
            <text>营业时间</text>
            <text class="back-font" v-if="storeItem.businessDays[0].hoursList[0].endTime">
              {{storeItem.businessDays[0].hoursList[0].startTime}} - {{storeItem.businessDays[0].hoursList[0].endTime}}
            </text>
            <text class="back-font" v-else>暂无时间</text>
          </view>
        </view>
      </view>
    </view>
    <view v-if="isLoad && storeList.length == 0" class="nodata">
      当前地区暂无店铺
    </view>
    <!-- <view v-if="goTop" class="goTop" @click="scrollToTop">
      <text class="icon-font icon-icon-yijianxiangshang"></text>
    </view> -->
  </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'store-list',
  components: {
  },
  data() {
    return {
      provinceIndex: null,
      cityIndex: null,
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      storeList: [],
      cityList: [],
      provinceCode: '',
      cityCode: '',
      goTop: false,
      regionsList: [],
      isLoad: false,
      userLatitude: '',
      userLongitude: '',
      isFlag: true,
    }
  },
  onPageScroll(e) {
    if (e.scrollTop > 200) {
      this.goTop = true;
    } else {
      this.goTop = false;
    }
  },
  computed: {
    // ...mapGetters('order', ['regionsList']),
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  onShow() {
    this.getUserLocation()
    this.getRegions()
  },
  methods: {
    ...mapActions('user', ['shopApi']),
    ...mapActions('order', ['getRegionsList']),
    // 获取省市
    async getRegions() {
      try {
        this.getShop()
      } catch (error) {
        console.log(error)
      }
    },
    // 获取精品店列表数据
    async getShop(province, city, area) {
      uni.showLoading({
        title: '加载中...',
      })
      const params = {
        province: province || '',
        city: city || '',
        area: area || '',
        storeType: 'OFFLINE',
      }
      try {
        const shop = await this.shopApi(params);
        uni.hideLoading()
        this.isLoad = true
        shop.data.shop.storeLocations.map(item => {
          if(item.storeStatus){
            this.storeList.push(item);
          }
        });
        console.log('storeList.length', this.storeList.length)
        if (this.storeList.length > 0) {
          if (this.isFlag) {
          // 省市聚合
            const regions = []
            this.storeList.map((item) => {
              const items = {
                cityCode: item.cityCode,
                cityName: item.cityName,
                code: item.provinceCode,
                name: item.provinceName,
              }
              regions.push(items)
            })
            const newArr = new Map();
            const unique = regions.filter((arr) => !newArr.has(arr.cityCode) && newArr.set(arr.cityCode, 1))
            this.regionsList = this.polymerization(unique)
            this.regionsList.unshift(
              {
                code: '',
                name: '全部',
                children: [],
              },
            )
            this.regionsList = this.regionsList.map((item) => ({
              ...item,
              children: [
                {
                  code: '',
                  name: '全部',
                },
                ...item.children,
              ],
            }))
            this.isFlag = false
          }

          this.calculate()
        }
      } catch (err) {
        uni.hideLoading()
        this.isLoad = true
        this.showMessage(err);
      }
    },
    // 聚合数组
    polymerization(arr) {
      const map = {};
      const dest = [];
      for (let i = 0; i < arr.length; i++) {
        const ai = arr[i];
        if (!map[ai.code]) {
          dest.push({
            name: ai.name,
            code: ai.code,
            children: [{
              name: ai.cityName,
              code: ai.cityCode,
            }],
          });
          map[ai.code] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            const dj = dest[j];
            if (dj.code == ai.code) {
              dj.children.push({
                name: ai.cityName,
                code: ai.cityCode,
              });
              break;
            }
          }
        }
      }
      return dest
    },
    // 获取用户地理位置
    getUserLocation() {
      console.log('获取地理位置')
      const that = this;
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          // console.log('locaton', res)
          const { latitude, longitude } = res
          that.userLatitude = latitude,
          that.userLongitude = longitude
          that.calculate()
        },
        fail(err) {
          console.log('获取地理位置失败', err)
          wx.showModal({
            title: '您未开启地理位置授权',
            content: '小程序将获取您的授权来显示地理位置信息',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting()
              }
            },
          })
        },
      })
    },
    // 循环计算所有精品店距离
    calculate() {
      const latitude = this.userLatitude
      const longitude = this.userLongitude
      if (latitude && longitude) {
        const mapList = this.storeList.map((item) => {
          if (item.latitude && item.longitude) {
            const distance = this.getDistance(latitude, longitude, item.latitude, item.longitude)
            return { ...item, distance }
          }
          return { ...item, distance: 0 }
        })
        this.storeList = mapList.sort(this.compare('distance'))
      }
    },
    // 排序函数
    compare(property) {
      return function (a, b) {
        const value1 = a[property];
        const value2 = b[property];
        return value1 - value2;
      }
    },
    // 计算用户当前位置距离精品店距离
    // lat1用户的纬度, lng1用户的经度
    // lat2商家的纬度,lng2商家的经度
    getDistance(lat1, lng1, lat2, lng2) {
      const radLat1 = this.Rad(lat1);
      const radLat2 = this.Rad(lat2);
      const a = radLat1 - radLat2;
      const b = this.Rad(lng1) - this.Rad(lng2);
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10000;
      // 保留两位小数
      s = s.toFixed(2)
      // console.log(`经纬度计算的距离:${s}`)
      return s
    },
    // 根据经纬度判断距离
    Rad(d) {
      return d * Math.PI / 180.0;
    },
    // 点击地图
    toMap(e) {
      console.log('map', e)
      wx.openLocation({
        latitude: e.latitude,
        longitude: e.longitude,
        scale: 18,
        name: e.locationName,
        address: e.address,
      })
    },
    // 省份
    bindProvinceChange(e) {
      console.log('111')
      this.provinceIndex = Number(e.detail.value)
      this.cityList = this.regionsList[this.provinceIndex].children
      this.cityIndex = null
      console.log('省份', this.regionsList[this.provinceIndex])
      this.provinceCode = this.regionsList[this.provinceIndex].code
      this.getShop(this.provinceCode)
    },
    // 城市
    bindCityChange(e) {
      if (this.provinceIndex == null) {
        uni.showToast({
          title: '请先选择省份！',
          icon: 'none',
        });
      } else {
        this.cityIndex = Number(e.detail.value)
        this.cityCode = this.regionsList[this.provinceIndex].children[this.cityIndex].code
        this.getShop(this.provinceCode, this.cityCode)
      }
    },
    // 打电话
    handleMakePhoneCall(num) {
      uni.makePhoneCall({
        phoneNumber: num,
      });
    },
    // 回到顶部
    scrollToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
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
  @import './index.scss';
</style>
