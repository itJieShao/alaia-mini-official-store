// 我的
<template>
  <view>
    <scroll-view class="scroll-container" :style="{'padding-top':ktxStatusHeight}" :scroll-y="true">
      <custom-nav-bar :left-arrow="false" :head-font-color="false" />
      <view class="container">
        <!-- account header -->
        <view class="account-header" @click="goNextPage('/subPackages/editAccount/pages/index')">
          <!-- 背景图片 -->
          <image class="account-bg" :src="`https://scm-dam.oss-cn-shanghai.aliyuncs.com/scm-dam/2021-10-22/0.20207557526373865%E4%BD%8D%E5%9B%BE.jpg`"
            mode="widthFix" :lazy-load="true" />
          <!-- 头像 -->
          <view class="account-head-photo-box">
            <image :src="headPhoto" mode="aspectFill" />
          </view>
        </view>
        <!-- 昵称 & 编辑资料入口 -->
        <view class="login-entrance">
          <view class="login-entrance-btn">{{ custName || nickName || ''}}</view>
          <text class="icon-font icon-bianji" @click="goNextPage('/subPackages/editAccount/pages/index')"></text>
        </view>
        <!-- 我的订单等入口 -->
        <view class="account-content">
          <view class="account-entrance-box">
            <view class="accout-entrance-item" v-for="(accountItem,index) in accountList" :key="index"
              @click="goNextPage(accountItem.path)">
              <text :class="['icon-font',accountItem.icon]"></text>
              <view class="ent-name">{{accountItem.name}}</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import {
    mapActions,
    mapMutations
  } from 'vuex';
  import {
    get
  } from '@/utils/utilityOperationHelper';
  import {
    MOBILE,
    IS_MEMBER_LOGIN,
    OPEN_ID,
    UNION_ID,
    WX_INFO,
    USER_INFO,
    SERVICE_TEL
  } from '../../constants/user'
  import {
    SCREEN_NAME,
    trackerCommonPageView
  } from '../../utils/ga'
  import zCheckbox from '@/components/al-checkbox';
  export default {
    components: {
      zCheckbox
    },
    data() {
      return {
        ktxStatusHeight: getApp().globalData.ktxStatusHeight,
        newDateTime: Date.parse(new Date()),
        headPhoto: `https://res-tasaki.baozun.com/static/images/account/default-head-photo.png?${Date.parse(new Date())}`, // 默认头像
        nickName: '',
        custName: '',
        accountList: [{
            name: '我的订单',
            icon: 'icon-wodedingdan',
            path: '/subPackages/order/pages/order-list/index',
          },
          {
            name: '心愿单',
            icon: 'icon-xinyuandan',
            path: '/subPackages/wish/pages/wish/index',
          },
          {
            name: '精品店',
            icon: 'icon-jingpindian',
            path: '/subPackages/store-list/pages/store-list/index',
          },
          {
            name: '我的地址',
            icon: 'icon-wodedizhi',
            path: '/subPackages/address/pages/list/index',
          },
          {
            name: '个人信息',
            icon: 'icon-gerenxinxi',
            path: '/subPackages/editAccount/pages/index',
          },
          {
            name: '帮助中心',
            icon: 'icon-bangzhuzhongxin',
            path: '/subPackages/help/pages/help/index',
          },
        ],
        SERVICE_TEL,
      };
    },
    onShow() {
      this.setTabSelected(4);
      trackerCommonPageView(SCREEN_NAME.ACCOUNT)
      this.pageReLoad();
    },
    // 阻止下拉刷新
    onPullDownRefresh() {
      wx.stopPullDownRefresh();
    },
    methods: {
      get,
      ...mapMutations('globle', ['setTabSelected']),
      ...mapActions('user', ['getUserInfo', 'editAccountInfo', 'bindMobileByEncryptedData']),
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
      pageReLoad() {
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
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
