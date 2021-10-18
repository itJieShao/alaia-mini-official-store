// 我的
<template>
  <scroll-view class="scroll-container" :style="{'padding-top':ktxStatusHeight}" :scroll-y="true">
    <custom-nav-bar :left-arrow="false" :head-font-color="false" />
    <view class="container">
      <!-- account header -->
      <view class="account-header" @click="goNextPage('/subPackages/editAccount/pages/index')">
        <!-- 背景图片 -->
        <image class="account-bg" :src="`https://res-tasaki.baozun.com/static/images/account/account-bg2.png`"
          mode="widthFix" :lazy-load="true" />
        <!-- 头像 -->
        <view class="account-head-photo-box">
          <image :src="headPhoto" mode="aspectFill" />
        </view>
      </view>
      <!-- 昵称 & 编辑资料入口 -->
      <view class="login-entrance">
        <view class="login-entrance-btn" v-if="!(isLogin && isUserInfo)" @click="goLoginPage">登录/注册</view>
        <view class="login-entrance-btn" v-else>{{ custName || nickName || ''}}</view>
        <text class="icon-font icon-icon-shezhi" @click="goNextPage('/subPackages/editAccount/pages/index')"></text>
      </view>
      <!-- 我的订单等入口 -->
      <view class="account-content">
        <view class="account-entrance-box">
          <view class="accout-entrance-item" v-for="(accountItem,index) in accountList" :key="index"
            @click="goNextPage(accountItem.path)">
            <image :src="accountItem.imageUrl" mode="widthFix" />
            <view class="ent-name">{{accountItem.name}}</view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
  import {
    mapActions,
    mapMutations
  } from 'vuex';
  import {
    USER_INFO,
    SERVICE_TEL
  } from '../../constants/user'
  import {
    SCREEN_NAME,
    trackerCommonPageView
  } from '../../utils/ga'

  export default {
    data() {
      return {
        ktxStatusHeight: getApp().globalData.ktxStatusHeight,
        newDateTime: Date.parse(new Date()),
        headPhoto: `https://res-tasaki.baozun.com/static/images/account/default-head-photo.png?${Date.parse(new Date())}`, // 默认头像
        nickName: '',
        custName: '',
        accountList: [{
            name: '我的订单',
            imageUrl: 'https://res-tasaki.baozun.com/static/images/icon-dingdan.png',
            path: '/subPackages/order/pages/order-list/index',
          },
          {
            name: '心愿单',
            imageUrl: 'https://res-tasaki.baozun.com/static/images/icon-dingdan.png',
            path: '/subPackages/wish/pages/wish/index',
          },
          {
            name: '精品店',
            imageUrl: 'https://res-tasaki.baozun.com/static/images/icon-jingpindian.png',
            path: '/subPackages/store-list/pages/store-list/index',
          },
          {
            name: '我的地址',
            imageUrl: 'https://res-tasaki.baozun.com/static/images/icon-icon-dizhibu.png',
            path: '/subPackages/address/pages/list/index',
          },
          {
            name: '个人信息',
            imageUrl: 'https://res-tasaki.baozun.com/static/images/icon-icon-dizhibu.png',
            path: '/subPackages/editAccount/pages/index',
          },
          {
            name: '帮助中心',
            imageUrl: 'https://res-tasaki.baozun.com/static/images/icon-bangzhuzhongxin.png',
            path: '/subPackages/help/pages/help/index',
          },
        ],
        SERVICE_TEL,
        isLogin: false,
        isUserInfo: false,
      };
    },
    onShow() {
      this.setTabSelected(4);
      trackerCommonPageView(SCREEN_NAME.ACCOUNT)
      this.getUserInfo().then((res) => {
        const {
          accountInfo
        } = uni.getStorageSync(USER_INFO) || {};
        const isMemberLogin = uni.getStorageSync('isMemberLogin') || false;
        const isAuthorizeInfo = uni.getStorageSync('isAuthorizeInfo') || false;
        const {
          avatarUrl,
          nickName
        } = uni.getStorageSync('weixinInfo') || {};

        this.isLogin = isMemberLogin; // 判断是否登录
        this.isUserInfo = isAuthorizeInfo; // 判断是否授权用户信息
        if (isAuthorizeInfo) {
          if (avatarUrl) this.headPhoto = avatarUrl; // 用户头像
          this.nickName = nickName || ''; // 微信昵称
          this.custName = accountInfo.name || ''; // 姓名
        }
        console.log(isMemberLogin, isAuthorizeInfo, avatarUrl, nickName)
        console.log('是否登录12', accountInfo, this.isLogin, this.isUserInfo);
      })
    },
    // 阻止下拉刷新
    onPullDownRefresh() {
      wx.stopPullDownRefresh();
    },
    methods: {
      ...mapMutations('globle', ['setTabSelected']),
      ...mapActions('user', ['getUserInfo']),
      // 判断是否登录
      async judgeLogin(callback) {
        if (!this.isLogin || !this.isUserInfo) {
          this.goLoginPage();
        } else {
          callback && callback();
        }
      },
      // 去我的订单/精品店/地址簿/帮助中心页面
      goNextPage(url) {
        if (!url) return;
        this.judgeLogin(() => {
          uni.navigateTo({
            url
          })
        })
      },
      // 去登录页
      goLoginPage() {
        uni.navigateTo({
          url: '/subPackages/login/pages/login/index',
        })
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
