<template>
  <view>
    <custom-nav-bar title=" " :head-border="false" :head-blank="true" :has-left-radius="true" />
    <view class="container">
      <view class="no-login">
        <view class="no-login-con">
          <text class="icon-font icon-logo-alaia_000 logo"></text>
          <text class="desc1">欢迎加入</text>
          <text class="desc2">授权我们获取您的手机号即可完成注册流程</text>
          <block v-if="!isGetUserInfo && isAuthorizeInfo == false">
            <button class="login-btn" open-type="getUserInfo" @click="doLogin">
              立即登录
            </button>
          </block>
          <block v-if="isGetUserInfo || isAuthorizeInfo == true">
            <button class="login-btn" v-if="isAgreeYSXY" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
              授权手机号
            </button>
            <button class="login-btn" v-else @click="showAgreeTip">
              授权手机号
            </button>
            <view class="agreement-content">
              <z-checkbox @checkEvent="handleReceiverCheck" :checked="isAgreeYSXY"></z-checkbox>
              <view class="privacy-txt" @click="handleReceiverCheck"> 我已阅读并接受ALAÏA<view class="under-line"
                  @click.stop="handleToRule">销售条款</view>及
                <view class="under-line" @click.stop="handleToPrivacy">隐私政策</view>。
              </view>
            </view>
            <view style="display: block;" class="agreement-content" v-if="isAgreeYSXY">
              我们ALAÏA为向您提供产品或服务
              (包括履行订购及维修单，提供售后服务，发送有关服务的信息，包括订单确认及处理您的查询和请求等)、传送营销信息及进行市场分析和调研（包括分析购买偏好及趋势），需要处理您的个人信息，并将您的个人信息披露给我们境外的关联公司。这些关联公司的名称和联系资料请见
              <view class="under-line" @click.stop="handleToPrivacy">此处链接</view>。
            </view>
          </block>     
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex';
  import customButton from '@/components/button/normal.vue';
  import errorCode from '@/constants/errorCode';
  import zCheckbox from '@/components/al-checkbox';
  import {
    WX_INFO,
    ORDER_INFO,
    PROTOCOL,
    USER_INFO,
    USER_WX_INFO,
    DISAGREE,
    AGREE,
    MOBILE,
    OPEN_ID,
    UNION_ID,
    IS_MEMBER_LOGIN,
  } from '@/constants/user';
  import {
    decryptData
  } from '@/service/apis/account';
  import {
    get
  } from '@/utils/utilityOperationHelper';

  export default {
    components: {
      customButton,
      zCheckbox
    },
    props: {},
    data() {
      return {
        newDateTime: Date.parse(new Date()),
        ktxStatusHeight: getApp().globalData.ktxStatusHeight,
        isGetUserInfo: false,
        isAgreeYSXY: false,
        accountInfo: {}, // 用户信息
        isAgree: false,
        // 是否授权过用户信心
        isAuthorizeInfo: false,
        // 是否支持getUserProfile
        canIUseGetUserProfile: false,
      };
    },
    onshow() {},
    onPullDownRefresh() {
      wx.stopPullDownRefresh();
    },
    onLoad() {
      if (wx.getUserProfile) {
        this.canIUseGetUserProfile = true;
      }
      uni.getStorageSync('isAuthorizeInfo') ?
        (this.isAuthorizeInfo = true) :
        (this.isAuthorizeInfo = false);
    },
    methods: {
      get,
      ...mapActions('user', [
        'decryptData',
        'bindMobileByEncryptedData',
        'editAccountInfo',
        'getUserInfo',
      ]),
      handleReceiverCheck() {
        this.isAgreeYSXY = !this.isAgreeYSXY;
      },
      // 立即登录
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
      showAgreeTip() {
        uni.showToast({
          title: '请勾选接受ALAÏA销售条款及隐私政策',
          icon: 'none',
        });
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
          uni.navigateBack();
        }
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
              uni.navigateBack();
            }
          }
        } catch (err) {
          console.log(err);
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
  @import "@/styles/base.scss";

  .no-login {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: url("https://scm-dam.oss-cn-shanghai.aliyuncs.com/scm-dam/2021-10-22/0.8128166725597985%E7%99%BB%E5%BD%95%E8%83%8C%E6%99%AF%E5%9B%BE.jpg");
    background-size: cover;

    .bg {
      width: 100%;
      height: 100%;
    }

    .no-login-con {
      display: flex;
      flex-direction: column;
      position: absolute;

      .icon-font {
        font-size: 120rpx;
        text-align: center;
        color: #fff;
        margin-bottom: 80rpx;
      }

      .desc1 {
        text-align: center;
        font-weight: bold;
        color: #fff;
        font-size: rpx(24);
      }

      .desc2 {
        text-align: center;
        color: #fff;
        font-size: rpx(12);
        margin-top: rpx(10);
      }

      .login-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        width: rpx(290);
        height: rpx(42);
        line-height: rpx(20);
        background-color: #fff;
        font-size: rpx(14);
        color: #1D1D1D;
        border: none;
        margin-top: rpx(35);
        line-height: inherit;
      }

      .agreement-content {
        width: rpx(290);
        margin-top: rpx(20);
        display: flex;
        font-size: rpx(12);
        font-family: 'PingFangSC';
        letter-spacing: rpx(1);
        color: #BBBBBB;

        .under-line {
          margin-left: 0rpx;
          text-decoration: underline;
          color: #FFFFFF;
          font-weight: normal;
          display: inline-block;
        }

        .privacy-txt {
          margin-left: rpx(12);
          letter-spacing: 2rpx;
        }
      }
    }
  }
</style>
