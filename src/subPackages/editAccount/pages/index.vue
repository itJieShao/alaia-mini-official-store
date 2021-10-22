<template>
  <view class="editAccount">
    <custom-nav-bar :head-font-color="false" />
    <view :style="{'padding-top':ktxStatusHeight}"></view>
    <view class="account-top">
      <image class="bg" :src="`https://scm-dam.oss-cn-shanghai.aliyuncs.com/scm-dam/2021-10-22/0.20207557526373865%E4%BD%8D%E5%9B%BE.jpg`" mode="widthFix">
      </image>
      <view class="photo-box">
        <image :src="avatarUrl" mode="aspectFill" />
      </view>
    </view>
    <view class="title">
      <template v-if="formData.surnname || formData.name">{{formData.surnname}}{{formData.name}}</template>
      <template v-else>{{nickName}}</template>
    </view>
    <view class="form-box">
      <form @submit="submitBind">
        <view class="form-inner">
          <view class="input-box">
            <picker mode="selector" :range="genderArr" :value="genderIndex" @change="bindPickerChange">
              <view class="picker">
                <text>{{ genderArr[genderIndex] }}</text>
                <text class="icon-font icon-icon-xia"></text>
              </view>
            </picker>
          </view>
          <view class="input-box" style="display: flex;">
            <input style="flex: 1;" v-model="formData.surnname" name="surnname" placeholder="姓" />
            <input style="flex: 1;margin-left: 26rpx;" v-model="formData.name" name="name" placeholder="名" />
          </view>
          <view class="input-box">
            <picker mode="date" :disabled="isChangeDate" :value="date" :start="startDate" :end="endDate"
              @change="bindDateChange">
              <view class="picker uni-input">
                <text class="date-placeholder" v-if="date == null">生日日期</text>
                <text class="date-text" v-else>{{date}}</text>
                <text class="icon-font icon-icon-xia"></text>
              </view>
            </picker>
            <view class="errorMessage" v-if="rules.isDate">*请选择生日日期</view>
          </view>
          <view class="input-box">
            <input v-model="formData.iphone" :disabled="true" @input="inputphone" name="iphone" placeholder="手机号" />
            <!-- <view class="errorMessage" v-if="rules.isIphone">*请填写正确的手机号</view> -->
          </view>
          <view class="input-box">
            <input v-model="formData.email" name="email" placeholder="电子邮箱" />
            <view class="errorMessage" v-if="rules.isEmail">*请填写正确的电子邮箱</view>
          </view>
        </view>
        <view class="handle">
          <button form-type="submit">保存信息</button>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex';
  import utils from '@/utils/utils.js';
  import {
    USER_INFO,
    PROTOCOL,
  } from '../../../constants/user';

  export default {
    name: 'editAccount',
    data() {
      const currentDate = this.getDate({
        format: true,
      })
      return {
        newDateTime: Date.parse(new Date()),
        formData: {
          surnname: '',
          name: '',
          iphone: '',
          email: '',
        },
        genderIndex: 1,
        genderArr: ['先生', '女士'],
        date: null,
        rules: {
          isGender: false,
          isSurnname: false,
          isName: false,
          isDate: false,
          isIphone: false,
          isEmail: false,
        },
        avatarUrl: 'https://res-tasaki.baozun.com/static/images/account/default-head-photo.png',
        ktxStatusHeight: getApp().globalData.ktxStatusHeight,
        nickName: '',
        isChangeDate: true,
      }
    },
    computed: {
      startDate() {
        return this.getDate('start');
      },
      endDate() {
        return this.getDate('end');
      },
      endDate() {
        const nowTime = new Date()
        const year = nowTime.getFullYear()
        let month = nowTime.getMonth() + 1
        month = month > 9 ? month : `0${month}`
        let date = nowTime.getDate()
        date = date > 9 ? date : `0${date}`
        return [year, month, date].join('-')
      },
    },
    onShow() {
      this.getAvatarUrl()
      this.getAccountInfo()
    },
    mounted() {

    },
    methods: {
      ...mapActions('user', ['editAccountInfo', 'getAccountInfoApi']),
      // 获取头像
      getAvatarUrl() {
        const {
          avatarUrl,
          nickName
        } = uni.getStorageSync('weixinInfo') || {};
        this.avatarUrl = avatarUrl
        this.nickName = nickName
        console.log('AvatarUrl', avatarUrl)
      },
      // 获取用户信息
      async getAccountInfo() {
        try {
          const info = await this.getAccountInfoApi();
          const {
            customer
          } = info.data
          const {
            accountInfo
          } = info.data.customer
          console.log('accountInfo', accountInfo)
          if (!accountInfo.birthday) {
            this.isChangeDate = false
          } else {
            this.isChangeDate = true
          }
          this.genderIndex = accountInfo.appellation == 'MR' ? 0 : 1;
          this.formData.name = accountInfo.firstName || '';
          this.formData.surnname = accountInfo.lastName || '';
          this.date = accountInfo.birthday;
          this.formData.iphone = customer.mobile
          this.formData.email = accountInfo.email
        } catch (err) {
          console.log(err);
          this.showMessage(err);
        }
      },
      // 称谓修改
      bindPickerChange(e) {
        this.genderIndex = Number(e.detail.value);
      },
      // 获取日期
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
      // 日期修改
      bindDateChange(e) {
        this.date = e.detail.value
        const dataArr = e.detail.value.split('-');
        if (dataArr[0]) {
          this.rules = {
            ...this.rules,
            isbirthday: false,
          };
        } else {
          this.rules = {
            ...this.rules,
            isbirthday: true,
          };
        }
      },
      // 提交表单
      async submitBind(e) {
        console.log(this.formData)
        const {
          name,
          surnname,
          email,
          iphone,
        } = this.formData
        const genderType = this.genderIndex;
        const birthday = this.date
        // if(!name || !utils.isChinese(name)){
        //   this.rules.isName = true
        // }else{
        //   this.rules.isName = false
        // }
        // if(!surnname || !utils.isChinese(surnname)){
        //   this.rules.isSurnname = true
        // }else{
        //   this.rules.isSurnname = false
        // }
        if (!birthday) {
          this.rules.isDate = true
        } else {
          this.rules.isDate = false
        }
        // if(!iphone ||!utils.isPhone(iphone)){
        //   this.rules.isIphone = true
        // }else{
        //   this.rules.isIphone = false
        // }
        if (email && !utils.isEmail(email)) {
          this.rules.isEmail = true
        } else {
          this.rules.isEmail = false
        }
        const validate = Object.values(this.rules).includes(true)
        // console.log(Object.values(this.rules))
        // console.log('validate',validate)
        if (validate) {
          uni.showToast({
            title: '请填写正确信息！',
            icon: 'none',
          });
          return
        }
        const params = {
          name: surnname || name ? surnname + name : '',
          firstName: name,
          lastName: surnname,
          birthday: this.date || '',
          appellation: this.genderIndex == 0 ? 'MR' : 'MRS',
          email,
          mobile: iphone,
        }
        console.log(params);
        try {
          const updated = await this.editAccountInfo({
            input: params,
          });
          if (updated.data.updateAccountInfo) {
            uni.showToast({
              title: '编辑成功！',
              icon: 'none',
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1000)
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
      // 姓输入框
      inputSurnname(e) {
        const surnname = e.detail.value;
        if (!utils.isChinese(surnname)) {
          this.rules = {
            ...this.rules,
            isSurnname: true,
          };
        } else {
          this.rules = {
            ...this.rules,
            isSurnname: false,
          };
        }
      },
      // 名输入框
      inputname(e) {
        const name = e.detail.value;
        if (!utils.isChinese(name)) {
          this.rules = {
            ...this.rules,
            isName: true,
          };
        } else {
          this.rules = {
            ...this.rules,
            isName: false,
          };
        }
      },
      inputphone(e) {
        if (!utils.isPhone(e.detail.value)) {
          this.rules = {
            ...this.rules,
            isIphone: true,
          };
        } else {
          this.rules = {
            ...this.rules,
            isIphone: false,
          };
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
