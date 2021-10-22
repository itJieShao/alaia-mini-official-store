// 我的
<template>
  <view>
    <view class="no-login" v-if="!(isLogin && isUserInfo)">
      <image class="bg" src="https://scm-dam.oss-cn-shanghai.aliyuncs.com/scm-dam/2021-10-22/0.8128166725597985%E7%99%BB%E5%BD%95%E8%83%8C%E6%99%AF%E5%9B%BE.jpg" mode="scaleToFill">
      </image>
      <view class="no-login-con">
        <text class="icon-font icon-logo-alaia_000 logo"></text>
        <block v-if="!isGetUserInfo && isAuthorizeInfo == false">
          <text class="desc1">欢迎加入</text>
          <text class="desc2">授权我们获取您的手机号即可完成注册流程</text>
          <button class="login-btn" open-type="getUserInfo" @click="doLogin">
            立即登录
          </button>
        </block>
        <block v-if="isGetUserInfo || isAuthorizeInfo == true">
          <text class="desc1">欢迎加入</text>
          <text class="desc2">授权我们获取您的手机号即可完成注册流程</text>
          <button class="login-btn" v-if="isAgreeYSXY" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            授权手机号
          </button>
          <button class="login-btn" v-else @click="showAgreeTip">
            授权手机号
          </button>
          <view class="agreement-content">
            <z-checkbox @checkEvent="handleReceiverCheck" :checked="isAgreeYSXY"></z-checkbox>
            <view class="privacy-txt" @click="handleReceiverCheck"> 我已阅读并接受ALAIA<view class="under-line"
                @click.stop="handleToRule">销售条款</view>及
              <view class="under-line" @click.stop="handleToPrivacy">隐私政策</view>。
            </view>
          </view>
        </block>
      </view>
    </view>
    <scroll-view v-else class="scroll-container" :style="{'padding-top':ktxStatusHeight}" :scroll-y="true">
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
          <!-- <view class="login-entrance-btn">{{ custName || nickName || ''}}</view> -->
          <text class="icon-font icon-icon-shezhi" @click="goNextPage('/subPackages/editAccount/pages/index')"></text>
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
        isLogin: false,
        isUserInfo: false,
        isGetUserInfo: false,
        isAgreeYSXY: false,
        isAuthorizeInfo: false,
        canIUseGetUserProfile: false,
      };
    },
    onShow() {
      this.setTabSelected(4);
      trackerCommonPageView(SCREEN_NAME.ACCOUNT)
      this.pageReLoad();
      if (wx.getUserProfile) {
        this.canIUseGetUserProfile = true;
      }
      uni.getStorageSync('isAuthorizeInfo') ?
        (this.isAuthorizeInfo = true) :
        (this.isAuthorizeInfo = false);
      // this.getUserInfo().then((res) => {
      //   const {
      //     accountInfo
      //   } = uni.getStorageSync(USER_INFO) || {};
      //   const isMemberLogin = uni.getStorageSync('isMemberLogin') || false;
      //   const isAuthorizeInfo = uni.getStorageSync('isAuthorizeInfo') || false;
      //   const {
      //     avatarUrl,
      //     nickName
      //   } = uni.getStorageSync('weixinInfo') || {};

      //   this.isLogin = isMemberLogin; // 判断是否登录
      //   this.isUserInfo = isAuthorizeInfo; // 判断是否授权用户信息
      //   if (isAuthorizeInfo) {
      //     if (avatarUrl) this.headPhoto = avatarUrl; // 用户头像
      //     this.nickName = nickName || ''; // 微信昵称
      //     this.custName = accountInfo.name || ''; // 姓名
      //   }
      //   console.log(isMemberLogin, isAuthorizeInfo, avatarUrl, nickName)
      //   console.log('是否登录12', accountInfo, this.isLogin, this.isUserInfo);
      // })
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
      handleReceiverCheck() {
        this.isAgreeYSXY = !this.isAgreeYSXY
      },
      handleToRule() {
        uni.navigateTo({
          url: '/subPackages/help/pages/help-detail/index?name=销售条款&templateCode=help_content&contentCode=sales',
        });
      },
      handleToPrivacy() {
        uni.navigateTo({
          url: '/subPackages/help/pages/help-detail/index?name=隐私政策&templateCode=help_content&contentCode=privacy',
        });
      },
      async doLogin(e, params) {
        const {
          type
        } = e.target.dataset;
        if (!this.canIUseGetUserProfile && !this.isAuthorizeInfo) {
          wx.getUserInfo({
            success: (res) => {
              if (res.errMsg === 'getUserInfo:ok') {
                uni.setStorageSync('isAuthorizeInfo', true);
                uni.setStorageSync(WX_INFO, JSON.parse(res.rawData || '{}'));
                this.isAuthorizeInfo = true;
                this.isGetUserInfo = true;
                this.buyCommonFunc({
                  userInfo: res.rawData,
                  type,
                  params,
                  encryptInfo: res,
                });
              }
            },
            fail: () => {
              this.buyCommonFunc({
                userInfo: '{}',
                type,
                params,
                encryptInfo: {},
              });
            },
          });
          return;
        }
        if (this.canIUseGetUserProfile && !this.isAuthorizeInfo) {
          wx.getUserProfile({
            desc: '完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              uni.setStorageSync('isAuthorizeInfo', true);
              uni.setStorageSync(WX_INFO, JSON.parse(res.rawData || '{}'));
              this.isAuthorizeInfo = true;
              this.isGetUserInfo = true;
              this.buyCommonFunc({
                userInfo: res.rawData,
                type,
                params,
                encryptInfo: res,
              });
            },
            fail: () => {
              this.buyCommonFunc({
                userInfo: '{}',
                type,
                params,
                encryptInfo: {},
              });
            },
          });
        } else {
          this.buyCommonFunc({
            userInfo: uni.getStorageSync(WX_INFO),
            type,
            params,
          });
        }
        // await this.getUnionId(e);
      },
      showAgreeTip() {
        uni.showToast({
          title: '请勾选接受ALAÏA销售条款及隐私政策',
          icon: 'none',
        });
      },
      async getPhoneNumber(e) {
        if (e.detail.errMsg !== 'getPhoneNumber:ok') {
          uni.showToast({
            title: '授权失败 请再次授权',
            icon: 'none',
          });
          return;
        }
        const wxData = {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        };
        try {
          const bindBoolean = await this.bindMobileByEncryptedData(wxData);
          const errorMsg = get(bindBoolean, 'errors[0].message');
          if (errorMsg) {
            this.showMessage(errorMsg);
            return;
          }
          if (bindBoolean) {
            const getMobile = await this.getUserInfo();
            if (getMobile.mobile) {
              uni.setStorageSync(MOBILE, getMobile.mobile);
              uni.setStorageSync(IS_MEMBER_LOGIN, true);
              const ext = {
                unionId: uni.getStorageSync(UNION_ID) || '',
                openId: uni.getStorageSync(OPEN_ID) || '',
              };
              const params = {
                mobile: getMobile.mobile,
                ext: JSON.stringify(ext),
              };
              await this.editAccountInfo({
                input: params,
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
        this.pageReLoad();
      },
      // 公共函数
      buyCommonFunc({
        userInfo,
        encryptInfo
      } = {}) {
        uni.setStorageSync(WX_INFO, JSON.parse(userInfo || '{}'));
        if (userInfo && userInfo.indexOf('nickName') != -1) {
          const info = JSON.parse(userInfo || '{}')
          const params = {
            nickname: info.nickName,
            portrait: info.avatarUrl,
          };
          this.editAccountInfo({
            input: params,
          });
        }
        const isMemberLogin = uni.getStorageSync('isMemberLogin');
        const isAuthorizeInfo = uni.getStorageSync('isAuthorizeInfo');
        if (isMemberLogin && isAuthorizeInfo) {
          this.pageReLoad();
        }
      },
      // 显示错误信息
      showMessage(msg, errCode) {
        if (errCode && errorCode[errCode]) {
          const {
            message
          } = errorCode[errCode];
          if (message) {
            msg = message;
          }
        }

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
  };
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
