<template>
  <view class="address-add">
    <custom-nav-bar :head-font-color="false" :head-border="false" />
    <view :style="{'padding-top':ktxStatusHeight}"></view>
    <view class="title">
      <text v-if="code">编辑地址</text>
      <text v-else>添加新地址</text>
    </view>
    <view class="form-box">
      <form @submit="formSubmit" @reset="formReset">
        <view class="input-box">
          <input v-model="formData.name" name="name" placeholder="收件人姓名" />
        </view>
        <view class="input-box">
          <input v-model="formData.phone" name="phone" placeholder="手机号码" />
        </view>
        <view class="input-box">
          <picker
            mode="multiSelector"
            :range="multiArray"
            range-key="name"
            :value="valueIndex"
            @change="handleChange"
            @columnchange="handleColumnChange"
            >
              <view class="area">
                <text class="area-placeholder" v-if="!formData.area">所在地区</text>
                <text class="area-text" v-else>{{formData.area}}</text>
                <text class="icon-font icon-icon-xia"></text>
              </view>
          </picker>
        </view>
        <view class="input-box">
          <input v-model="formData.address" name="address" placeholder="详细地址" />
        </view>
        <view class="check-box">
          <text
            class="icon"
            @click="checkboxChange(item)"
            :class="formData.defaultAddress ? 'active' : ''"
          ></text>
          <text class="text">设为默认地址</text>
        </view>
        <view class="handle">
          <button @click="goBack">取消</button>
          <button :disabled="saveDisabled" form-type="submit">保存并使用</button>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { get } from '@/utils/utilityOperationHelper';
import utils from '@/utils/utils.js';
import zCheckbox from '@/components/checkbox';

export default {
  name: 'addressAdd',
  components: {
    zCheckbox,
  },
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        area: '',
        address: '',
        defaultAddress: false,
      },
      multiArray: [],
      valueIndex: [0, 0, 0],
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      code: '',
      saveDisabled: false
    }
  },
  computed: {
    ...mapGetters('order', ['regionsList']),
  },
  onLoad(option) {
    this.code = option.code
    this.getRegions(option.code)
  },
  onShow() {

  },
  created() {

  },
  mounted() {

  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  methods: {
    ...mapActions('order', ['getRegionsList', 'setAddressInfo']),
    ...mapActions('user', ['deliveryAddressCreateApi', 'deliveryAddressUpdateApi', 'deliveryAddressesApi']),
    // 获取省份、城市信息
    async getRegions(code) {
      try {
        await this.getRegionsList()
      } catch (error) {
        console.log(error)
      }
      if (code) {
        // 编辑
        this.getDeliveryAddresses(code)
      } else {
        // 新增
        this.$set(this.multiArray, 0, this.regionsList)
        this.$set(this.multiArray, 1, get(this.regionsList[0], 'children'))
        this.$set(this.multiArray, 2, get(this.regionsList[0].children[0], 'children'))
      }
    },
    // 获取收货地址列表
    async getDeliveryAddresses(code) {
      try {
        const list = await this.deliveryAddressesApi({ size: 1000, page: 1 });
        const addressList = list.data.customer.deliveryAddresses.edges
        const addressObj = addressList.filter((item) => item.node.code == code)
        const editAddress = addressObj[0].node
        console.log('editAddress', editAddress)
        this.formData.name = editAddress.receiverName
        this.formData.phone = editAddress.receiverMobile
        this.formData.address = editAddress.address
        this.formData.defaultAddress = editAddress.isDefault
        const provinceIndex = this.regionsList.findIndex(
          (item) => item.name === get(editAddress, 'province'),
        );
        const cityIndex = this.regionsList[provinceIndex].children.findIndex(
          (item) => item.name === get(editAddress, 'city'),
        );
        const districtIndex = this.regionsList[provinceIndex].children[cityIndex].children.findIndex(
          (item) => item.name === get(editAddress, 'district'),
        );
        this.valueIndex = [provinceIndex, cityIndex, districtIndex]
        this.handleChange()
        this.$set(this.multiArray, 0, this.regionsList)
        this.$set(this.multiArray, 1, get(this.regionsList[provinceIndex], 'children'))
        this.$set(this.multiArray, 2, get(this.regionsList[provinceIndex].children[cityIndex], 'children'))
      } catch (err) {
        console.log(err);
        this.showMessage(err);
      }
    },
    // 地区列改变
    handleColumnChange(e) {
      const { column, value } = e.detail
      if (column == 0) {
        // 第1列改变
        this.$set(this.valueIndex, 0, value)
        this.$set(this.valueIndex, 1, 0)
        this.$set(this.valueIndex, 2, 0)
        this.$set(this.multiArray, 1, this.regionsList[value].children)
        this.$set(this.multiArray, 2, this.regionsList[this.valueIndex[0]].children[this.valueIndex[1]].children)
      } else if (column == 1) {
        // 第2列改变
        this.$set(this.valueIndex, 1, value)
        this.$set(this.valueIndex, 2, 0)
        this.$set(this.multiArray, 2, this.regionsList[this.valueIndex[0]].children[this.valueIndex[1]].children)
      } else if (column == 2) {
        // 第3列改变
        this.$set(this.valueIndex, 2, value)
      }
    },
    // 地区改变
    handleChange(e) {
      this.formData.area = `${this.regionsList[this.valueIndex[0]].name}/${this.regionsList[this.valueIndex[0]].children[this.valueIndex[1]].name}/${this.regionsList[this.valueIndex[0]].children[this.valueIndex[1]].children[this.valueIndex[2]].name}`
    },
    // 是否是默认地址
    checkboxChange(e) {
      this.formData.defaultAddress = !this.formData.defaultAddress
    },
    async formSubmit(e) {
      console.log('e', e)
      const form = e.detail.value
      const { name, phone, address } = form
      const { area, defaultAddress } = this.formData
      if (!name || !phone || !area || !address) {
        uni.showToast({
          title: '请完善信息！',
          icon: 'none',
        })
        return
      }
      if (!utils.isPhone(phone)) {
        uni.showToast({
          title: '请填写正确的手机号！',
          icon: 'none',
        })
        return
      }
      const params = {
        receiverName: name,
        receiverMobile: phone,
        countryId: this.regionsList[this.valueIndex[0]].code,
        country: '中国',
        provinceId: this.regionsList[this.valueIndex[0]].code,
        province: this.regionsList[this.valueIndex[0]].name,
        cityId: this.regionsList[this.valueIndex[0]].children[this.valueIndex[1]].code,
        city: this.regionsList[this.valueIndex[0]].children[this.valueIndex[1]].name,
        districtId: this.regionsList[this.valueIndex[0]].children[this.valueIndex[1]].children[this.valueIndex[2]].code,
        district: this.regionsList[this.valueIndex[0]].children[this.valueIndex[1]].children[this.valueIndex[2]].name,
        address,
        isDefault: defaultAddress,
      }
      this.saveDisabled = true
      if (this.code) {
        // 编辑
        params.code = this.code
        try {
          const edit = await this.deliveryAddressUpdateApi(params);
          console.log(edit)
          this.resetForm()
          uni.showToast({
            title: '编辑成功！',
            icon: 'none',
          })
          this.saveDisabled = false
          setTimeout(() => {
            uni.navigateBack();
          }, 1000)
        } catch (err) {
          console.log(err);
          this.saveDisabled = false
          this.showMessage(err);
        }
      } else {
        // 新增
        try {
          const add = await this.deliveryAddressCreateApi(params);
          console.log('add', add)
          this.resetForm()
          uni.showToast({
            title: '新增成功！',
            icon: 'none',
          })
          this.saveDisabled = false
          setTimeout(() => {
            uni.navigateBack();
          }, 1000)
        } catch (err) {
          console.log(err);
          this.saveDisabled = false
          this.showMessage(err);
        }
      }
    },
    // 去下一页
    goNextPage(url) {
      console.log(url);
      uni.navigateTo({
        url,
      })
    },  
    // 返回上一页
    goBack(){
      uni.navigateBack();
    },
    // reset form
    resetForm(){
      this.formData= {
        name: '',
        phone: '',
        area: '',
        address: '',
        defaultAddress: false,
      }
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
