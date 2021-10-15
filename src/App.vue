<template>
  <view class="app"></view>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { gaTracker } from './utils/ga';
import log from './utils/log';
import { getBaInfoByShare } from './utils/baInfo';

export default {
  globalData: {
    ktxStatusHeight: 0, // 组件上面预留导航的高度
  },
  onLaunch (params) {
    log.info('App -- onLaunch');
    this.setTabSelected(0);
    this.loginByAuthCode().then(() => {
      if (this.openId) {
        this.$sr.setUser({
          open_id: this.openId, // 必传，字符串类型
        });
      }
      // gaTracker.setClientId(this.openId);
      // 如果是已经注册过，并已经登陆过的用户，同步一下crm的会员信息
      // if (this.userInfo.mobile) {
      //   this.syncCrmMemberInfo();
      // }
      // 计算购物车数量
      // this.queryCartInfo();
    });
    // this.qyLogin();
    if (!wx.qy) {
      // this.setBAInfo(getBaInfoByShare(params));
    }

    const systemInfo = wx.getSystemInfoSync();
    // px转换到rpx的比例
    // const pxToRpxScale = 750 / systemInfo.windowWidth;
    // this.globalData.ktxStatusHeight = `${
    //   systemInfo.statusBarHeight * pxToRpxScale + 88
    // }rpx`;
    this.globalData.ktxStatusHeight = `${systemInfo.statusBarHeight + 44}px`;

    // 广告转化跟踪
    this.setAdvertising(params);
    // 有数 初始化
    this.srInit();
  },
  onShow (params) {
    // 广告转化跟踪
    this.setAdvertising(params);
    // if (wx.qy) return;
    const baInfo = getBaInfoByShare(params);
    if (baInfo && baInfo.baId && baInfo.storeCode) {
      // this.setBAInfo(baInfo);
    }
    // 获取有数场景值开始 https://mp.zhls.qq.com/youshu-docs/develop/event/channel/chan_id.html
    const chan_id = this.getChanID(params);
    // console.log(`chan_id=${chan_id}`, params);
    // 获取有数场景值结束
  },
  // 不存在页面处理
  onPageNotFound (options) {
    log.warn('App -- onPageNotFound');
    const { query } = options;
    // console.log('---未找到的页面信息', options)
    const strList = [];
    for (const i in query) {
      i && strList.push(`${i}=${query[i]}`);
    }
    const path = '/pages/index/index';
    const redirectPath = strList.length > 0 ? `${path}?${strList.join('&')}` : path;
    log.warn('App -- onPageNotFound', redirectPath);
    uni.reLaunch({
      url: redirectPath,
    });
  },
  computed: {
    ...mapGetters('user', ['userInfo', 'openId']),
  },
  methods: {
    ...mapMutations('globle', ['setTabSelected', 'setAdvertisingParam']),
    ...mapActions('shoppingCart', ['queryCartInfo']),
    ...mapActions('user', ['loginByAuthCode']),
    ...mapActions('qy', ['setEnvironment', 'qyLogin', 'setBAInfo']),
    // 有数 初始化
    srInit () {
      this.$sr.init({
        // 有数 - ka‘接入测试用’ 分配的 app_id，对应的业务接口人负责
        token: 'bidbd509aa9af64d53', // 测试 bi7b7818a894d7498e
        // 微信小程序appID，以wx开头
        appid: 'wxe5bd54b04e85cd62',
        // 如果使用了小程序插件，需要设置为 true
        usePlugin: true,
        // 开启打印调试信息， 默认 false
        debug: true,
        /**
         * 建议开启-开启自动代理 Page， 默认 false
         * sdk 负责上报页面的 browse 、leave、share 等事件
         * 可以使用 sr.page 代替 Page(sr.page(options))
         * 元素事件跟踪，需要配合 autoTrack: true
         */
        proxyPage: true,
        /**
         * 建议开启-开启组件自动代理， 默认 false
         * sdk 负责上报页面的 browse 、leave、share 等事件
         */
        proxyComponent: true,
        // 建议开启-是否开启页面分享链路自动跟踪
        openSdkShareDepth: true,
        // 建议开启-元素事件跟踪，自动上报元素事件，入tap、change、longpress、confirm
        autoTrack: false,
        // 建议开启-自动化获取openId，授权过的小程序可自动化获取openId
        openAutoTrackOpenId: true,
      });

      const open_id = uni.getStorageSync('openId');
      if (open_id) {
        this.$sr.setUser({
          open_id, // 必传，字符串类型
        });
      }
      // console.log('open_id', open_id);
    },
    // 渠道ID
    async getChanID (query) {
      const chan_id = (query && query.query && query.query.chan_id) || query.chan_id;
      if (chan_id) {
        return chan_id;
      }

      let sceneInQuery = '';
      if (query && query.query && query.query.scene) {
        if (query.query.scene.indexOf('%3D') != -1) {
          sceneInQuery = decodeURIComponent(query.query.scene);
        } else if (
          wx.getStorageSync('sceneCode')
          || this.$store.state.globle.sceneCode
        ) {
          sceneInQuery = wx.getStorageSync('sceneCode')
            || this.$store.state.globle.sceneCode;
        } else {
          // const secnCode = await this.$store.dispatch('Pdp/analysisCode', {
          //   shorturl: query.query.scene,
          // });
          // if (secnCode.success && secnCode.data) {
          //   sceneInQuery = secnCode.data;
          // }
        }
      } else {
        sceneInQuery = decodeURIComponent(query.scene);
      }
      const match = sceneInQuery
        .split('&')
        .map((m) => m.match(/^chan_id=(.*)$/))
        .find((m) => !!m) || query.scene;
      // console.log(333, match, sceneInQuery, match[1]);
      if (match) {
        return match[1];
      }
    },
    /**
       * 广告转化跟踪
       * url参数中可以获取到gdt_vid、weixinadinfo参数值
       * */
    setAdvertising (options) {
      const gdt_vid = (options && options.query.gdt_vid) || '';
      const weixinadinfo = (options && options.query.weixinadinfo) || '';
      if (gdt_vid) {
        // 获取广告id
        let aid = 0;
        if (weixinadinfo) {
          const weixinadinfoArr = weixinadinfo.split('.');
          aid = weixinadinfoArr[0];
        }
        const advertisingParam = {
          gdt_vid,
          weixinadinfo,
          aid,
        };
        // console.log('advertising--->', advertisingParam);
        this.setAdvertisingParam(advertisingParam);
        wx.setStorageSync('advertisingParam', advertisingParam);
      }
    },
  },
};
</script>

<style>
</style>
