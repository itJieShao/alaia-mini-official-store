<template>
  <scroll-view
    class="authorize-dialog-container"
    :style="{ 'padding-top': ktxStatusHeight }"
    :scroll-y="true"
  >
    <custom-nav-bar :head-font-color="false" />
    <view class="authorize-dialog-main">
      <image
        class="authorize-dialog-bg"
        :src="`https://res-tasaki.baozun.com/static/images/authorize-dialog-bg1.jpg`"
        mode="widthFix"
      />
      <view class="authorization-section-content">
        <view class="description-1">欢迎光临TASAKI线上旗舰店</view>
        <block v-if="!isGetUserInfo && isAuthorizeInfo == false">
          <view class="description-2">登录即可尊享更多品牌资讯、会员权益</view>
          <button class="com-btn" open-type="getUserInfo" @click="doLogin">
            立即登录
          </button>
        </block>
        <block v-if="isGetUserInfo || isAuthorizeInfo == true">
          <view class="description-2">授权手机号即可登录成功</view>
          <button
            class="com-btn"
            open-type="getPhoneNumber"
            :disabled="!isAgreeYSXY"
            @getphonenumber="getPhoneNumber"
          >
            授权手机号
          </button>
          <view class="description-3"  @click="checkedEventer">
            <text
              class="checkbox"

              :class="isAgreeYSXY ? 'checked' : ''"
            ></text>
            我已阅读并接受TASAKI线上旗舰店的<text
              class="yszc"
              @click.stop="goHelpDetail"
              >隐私政策</text
            ></view
          >
        </block>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import customButton from '@/components/button/normal.vue';
import errorCode from '@/constants/errorCode';
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
import { decryptData } from '@/service/apis/account';
import { get } from '@/utils/utilityOperationHelper';

export default {
  components: {
    customButton,
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
    uni.getStorageSync('isAuthorizeInfo')
      ? (this.isAuthorizeInfo = true)
      : (this.isAuthorizeInfo = false);
  },
  methods: {
    get,
    ...mapActions('user', [
      'decryptData',
      'bindMobileByEncryptedData',
      'editAccountInfo',
      'getUserInfo',
    ]),
    // 立即登录
    async doLogin(e, params) {
      const { type } = e.target.dataset;
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
    // UnionID授权
    async getUnionId(e) {
      const userInfo = uni.getStorageSync(USER_INFO);

      if (userInfo && userInfo.mobile) {
        // this.goMine();
        return;
      }

      const { detail } = e;
      if (detail.errMsg === 'getUserInfo:ok') {
        const options = {
          encryptedData: detail.encryptedData,
          iv: detail.iv,
        };

        try {
          const result = await decryptData(options);
          uni.setStorageSync(USER_WX_INFO, get(result, 'data.decryptData'));
        } catch (err) {
          console.log(err);
        }
      }
    },
    handleGetUserInfo(firstGet = true) {
      try {
        const { mobile, accountInfo } = uni.getStorageSync(USER_INFO) || {};
        this.accountInfo = accountInfo;
        this.userMobile = mobile || '';
        if (accountInfo && accountInfo.ext) {
          const { agreePolicy, agreePromote } = JSON.parse(accountInfo.ext) || {};
          if (firstGet) {
            this.isAgree = agreePolicy === AGREE;
            // 如果数据库中查询没有勾选，那么看看本地localstorage中是否存储了数据
            this.isSubscribe = agreePromote === AGREE ? true : this.getLocalSub();
            this.originIsSubscribe = this.isSubscribe;
          }
        }
      } catch (error) {
        console.error(error, '获取用户信息失败');
      }
    },
    // 公共函数
    buyCommonFunc({ userInfo, encryptInfo } = {}) {
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
      // if (!this.unionId) {
      //   const { encryptedData, iv } = encryptInfo;
      //   if (encryptedData && iv) {
      //     this.bindMobileByEncryptedData({
      //       encryptedData,
      //       iv,
      //     });
      //   }
      // }
    },
    // 点击是否接受隐私条款
    checkedEventer() {
      this.isAgreeYSXY = !this.isAgreeYSXY;
    },
    judgeYSXY() {
      if (!this.isAgreeYSXY) {
        uni.showToast({
          title: '请先阅读并接受隐私协议',
          icon: 'none',
        });
        return;
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
          }
        }
      } catch (err) {
        console.log(err);
      }
      uni.redirectTo({
        url: '/subPackages/login/pages/personal-info-add/index',
      });
    },
    // 去查看隐私政策
    goHelpDetail() {
      const name = '隐私政策';
      const contentCode = 'privacy';
      uni.navigateTo({
        url: `/subPackages/help/pages/help-detail/index?name=${name}&templateCode=help_content&contentCode=${contentCode}`,
      });
    },
    // 显示错误信息
    showMessage(msg, errCode) {
      if (errCode && errorCode[errCode]) {
        const { message } = errorCode[errCode];
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
.authorize-dialog-container {
  width: 100vw;
  height: 100vh;
  // position: fixed;
  // top: 0;
  // left: 0;
  background: #fff;
  .authorize-dialog-main {
    .authorize-dialog-bg {
      width: 100vw;
    }
    .authorization-section-content {
      padding: 70rpx 32rpx 70rpx;
      color: #1d1d1d;
      text-align: center;
      .description-1 {
        font-size: 48rpx;
        line-height: 52rpx;
        margin-bottom: 44rpx;
      }
      .description-2 {
        font-size: 28rpx;
        color: #8e8e8e;
        line-height: 42rpx;
        margin-bottom: 74rpx;
      }
      .description-3 {
        margin-top: 34rpx;
        font-size: 28rpx;
        color: #8e8e8e;
        line-height: 42rpx;
        text-align: left;
        .checkbox {
          position: relative;
          top: 5rpx;
          display: inline-block;
          width: 32rpx;
          height: 32rpx;
          border: 1px solid #bbbbbb;
          border-radius: 50%;
          margin-right: 16rpx;
          &.checked {
            background: #e3f0ea;
          }
         &::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 56rpx;
          height: 56rpx;
        }
        }
        .icon-font {
          color: #e3f0ea;
          border: 1px solid #bbbbbb;
          border-radius: 50%;
          background-color: #000;
          margin-right: 16rpx;
        }
        .yszc {
          color: #000;
          // text-decoration: underline;
          border-bottom: 1px solid #000;
      }
      }
    }
  }
}

.com-btn {
  width: 686rpx;
  height: 80rpx;
  background-color: #e3f0ea;
  border: 1px solid #1d1d1d;
  font-size: 28rpx;
  color: #1d1d1d;
  line-height: 80rpx;
}
</style>
