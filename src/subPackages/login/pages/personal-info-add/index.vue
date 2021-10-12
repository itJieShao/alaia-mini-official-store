<template>
  <view class="personal-info-add" :style="{ 'padding-top': ktxStatusHeight }">
    <custom-nav-bar :head-font-color="false" />
    <view class="personal-info-add-tip">补全会员信息 尊享更多会员权益</view>
    <view class="form-box">
      <form @submit="submitBind">
        <view class="input-box">
          <picker
            mode="selector"
            :range="genderArr"
            :value="genderIndex"
            @change="bindPickerChange"
          >
            <view class="picker">
              <text v-if="genderIndex == null" class="placeholder">称谓</text>
              <text v-else>{{ genderArr[genderIndex] }}</text>
              <text class="icon-font icon-icon-xia"></text>
            </view>
          </picker>
        </view>
        <view class="input-box">
          <input
            v-model="formData.surnname"
            name="surnname"
            placeholder="姓氏"
          />
        </view>
        <view class="input-box">
          <input v-model="formData.name" name="name" placeholder="名字" />
        </view>
        <view class="input-box">
          <picker
            mode="date"
            :disabled="isChangeDate"
            :value="date"
            :start="startDate"
            :end="endDate"
            @change="bindDateChange"
          >
            <view class="picker uni-input">
              <text v-if="date == null" class="placeholder">生日</text>
              <text v-else>{{ date }}</text>
              <text class="icon-font icon-icon-xia"></text>
            </view>
          </picker>
        </view>
        <view class="input-box">
          <input
            v-model="formData.email"
            name="email"
            placeholder="电子邮箱（选填）"
          />
        </view>
        <view class="handle">
          <button form-type="submit">提交信息</button>
        </view>
      </form>
      <view class="pass" @click="pass">跳过</view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  USER_INFO, PROTOCOL, MOBILE,
  OPEN_ID,
  UNION_ID,
} from '@/constants/user';

export default {
  name: 'personal-info-add',
  components: {},
  data() {
    const currentDate = this.getDate({
      format: true,
    });
    return {
      formData: {
        surnname: '',
        name: '',
        email: '',
      },
      genderIndex: null,
      genderArr: ['先生', '女士'],
      date: null,
      defalutHeadPhoto:
        'https://res-tasaki.baozun.com/static/images/account/default-head-photo.png',
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      isChangeDate:false
    };
  },
  computed: {
    startDate() {
      return this.getDate('start');
    },
    // endDate() {
    //   return this.getDate('end');
    // },
    endDate() {
      const nowTime = new Date();
      const year = nowTime.getFullYear();
      let month = nowTime.getMonth() + 1;
      month = month > 9 ? month : `0${month}`;
      let date = nowTime.getDate();
      date = date > 9 ? date : `0${date}`;
      return [year, month, date].join('-');
    },
  },
  onShow() {
    this.getAccountInfo();
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  methods: {
    ...mapActions('user', ['editAccountInfo', 'getAccountInfoApi']),
    // 获取用户信息
    async getAccountInfo() {
      try {
        const info = await this.getAccountInfoApi();
        const { accountInfo } = info.data.customer;
        console.log(accountInfo.birthday,'birthday')
         if(!accountInfo.birthday){
          this.isChangeDate = false
        }else{
          this.isChangeDate = true
        }
        console.log('accountInfo', accountInfo);
        this.genderIndex = accountInfo.appellation == 'MRS' ? 1 : 0;
        this.formData.name = accountInfo.firstName;
        this.formData.surnname = accountInfo.lastName;
        this.date = accountInfo.birthday;
        this.formData.iphone = accountInfo.mobile;
        this.formData.email = accountInfo.email;
      } catch (err) {
        console.log(err);
        this.showMessage(err);
      }
    },
    bindPickerChange(e) {
      this.genderIndex = Number(e.detail.value);
      console.log('e', e);
    },
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === 'start') {
        year = year - 60;
      } else if (type === 'end') {
        year = year + 2;
      }
      month = month > 9 ? month : `0${month}`;
      day = day > 9 ? day : `0${day}`;
      return `${year}-${month}-${day}`;
    },
    bindDateChange(e) {
      this.date = e.detail.value;
      console.log(e.detail.value)
    },
    async submitBind(e) {
      const params = {
        name: this.formData.surnname || this.formData.name ? this.formData.surnname+this.formData.name :'',
        firstName: this.formData.name,
        lastName: this.formData.surnname,
        birthday: this.date,
        genderType: this.genderIndex === 0 ? 'MALE' : 'FEMALE',
        email: this.formData.email,
        mobile: uni.getStorageSync(MOBILE),
      };
      try {
        const updated = await this.editAccountInfo({
          input: params,
        });
        if (updated.data.updateAccountInfo) {
          uni.showToast({
            title: '提交成功！',
            icon: 'none',
          });

          setTimeout(uni.navigateBack(), 2000);
        }
      } catch (err) {
        console.log(err);
        this.showMessage(err);
      }
    },
    // 显示错误信息
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
    pass() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
