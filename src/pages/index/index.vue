<template>
  <view class="index">
    <!-- page Header -->
    <custom-nav-bar :left-icon="'search'" :left-text="'搜索'" :head-border="isHeadBorder" :head-blank="isHeadBlank" :head-font-color="isHeaderBlackColor" />
    <!-- page Container -->
    <view class="container">
      <swiper class="swiper" :current="current" easing-function="linear" :autoplay="false" :indicator-dots="false" :vertical="true" @change="swiperChange" @animationfinish="animationfinish">
        <swiper-item class="scroll-view">
          <!-- 首页顶部swiper -->
          <home-head-swiper :pageIsShow="pageIsShow" :parentCurrent="current" :homeHeadSwiperList="homeHeadSwiperList" :isPause="isPause" :isShowDost="isShowDost" @swiperChange="homeHeaderSwiperChange"></home-head-swiper>
        </swiper-item>
        <swiper-item>
          <scroll-view scroll-y class="scroll-view scroll-view-content" :style="{'paddingTop':ktxStatusHeight}" @scroll="viewScroll" :scroll-into-view="scrollToId">
            <product-swiper></product-swiper>
            <product-model></product-model>
            <product></product>
            <view style="padding-top: 50rpx;background-color: #fff;">
              <customButton :btnWidth="480" :btnHeight="80" className="transparent">即刻探索</customButton>
            </view>
            <!-- 品牌故事 -->
            <series-story id="seriesStory" :viewScrollTop="viewScrollTop" @fullscreenchange="fullscreenchange" :isPause="!isPause"></series-story>
            <!-- 精品店 -->
            <boutique></boutique>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters,
  mapMutations,
} from 'vuex';
import {
  trackWechatAd,
} from '@/service/apis'
import customButton from '@/components/button/normal.vue';
import HomeHeadSwiper from './components/homeHeadSwiper/homeHeadSwiper'; // 首页顶部swiper
import ProductSwiper from './components/prodcutSwiper/productSwiper'; // 首页轮播
import ProductModel from './components/productModel/productModel'; // 造型灵感
import Product from './components/product/product'; // 精选推荐
import SeriesStory from './components/seriesStory/seriesStory'; // 品牌故事
import Boutique from './components/boutique/boutique'; // 精品店

export default {
  name: 'index',
  components: {
    HomeHeadSwiper,
    ProductSwiper,
    ProductModel,
    Product,
    SeriesStory,
    Boutique,
    customButton,
  },
  data () {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight, // 头部的高度，用于设置样式padding-top
      isHeadBorder: false, // header border是否展示
      isHeadBlank: true, // header 是否透明
      isHeaderBlackColor: false, // header 字体颜色
      productWallList: [], // 产品墙数据
      current: 0, // swiper 当前下表
      isPause: false, // 是否要暂停首页视频
      homeHeadSwiperList: [], // 第一屏轮播图数据
      productSwiperOneList: [], // 产品轮播第一屏
      productSwiperTwoData: {}, // 产品轮播第二屏
      productSwiperThreeData: {}, // 产品轮播第三屏
      viewScrollTop: '',
      scrollToId: '',
      pageIsShow: false,
      isShowDost: true,
    };
  },
  // 分享配置项
  onShareAppMessage (res) {
    return {
      title: 'TASAKI塔思琦线上旗舰店',
      path: 'pages/index/index',
      imageUrl: '',
      success () { },
    };
  },
  onPageScroll (e) {
    // if (e.scrollTop > 100) {
    //   this.goTop = true;
    // } else {
    //   this.goTop = false;
    // }
    // // 获取当前窗口滚动条顶部所在的像素值 并取整
    // const topScroll = Math.floor(e.scrollTop);
    // // 设置滚动多少像素后出背景色
    // const scrollDist = 180;
    // // 定义滚动条在向下滚动180像素后
    // if (topScroll <= scrollDist) {
    //   this.isHeadBorder = false;
    //   this.isHeadBlank = true;
    // } else {
    //   this.isHeadBorder = true;
    //   this.isHeadBlank = false;
    // }
  },
  computed: {},
  created () {
    this.getIndexPageContent();
  },
  onShow () {
    this.pageIsShow = true;
    this.setTabSelected(0);
    console.log('首页', this.pageIsShow)
    const advertising = uni.getStorageSync('advertisingParam') || this.advertisingParam;
    if (advertising && advertising.gdt_vid) {
      this.wechatTrack(advertising.gdt_vid);
    }

    // 判断是否授权用户信息
    // const isAuthorizeInfo = uni.getStorageSync('isAuthorizeInfo')
    // if (!isAuthorizeInfo) {
    //   this.getUserInfo().then((res) => {
    //     if (res.accountInfo.nickname || res.accountInfo.portrait) {
    //       uni.setStorageSync('isAuthorizeInfo', true)
    //       uni.setStorageSync('weixinInfo', {
    //         nickName: res.accountInfo.nickname,
    //         avatarUrl: res.accountInfo.portrait,
    //       })
    //     } else {
    //       uni.setStorageSync('isAuthorizeInfo', false)
    //     }
    //   })
    // }
  },
  onLoad () {

  },
  onHide () {
    this.pageIsShow = false;
    console.log('首页', this.pageIsShow)
  },
  onPullDownRefresh () {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  methods: {
    ...mapActions('category', ['getCategoryData']),
    ...mapActions('common', ['getAccessToken']),
    ...mapState('globle', ['advertisingParam']),
    ...mapMutations('globle', ['setTabBarHide', 'setTabSelected']),
    ...mapActions('user', ['getUserInfo']),
    // 获取首页数据
    async getIndexPageContent () {
      const indexContent = await this.getCategoryData();
      console.log('首页数据 ===>', indexContent[0]);
      if (indexContent) {
        this.homeHeadSwiperList = indexContent[0].children[0].children; // 第一屏轮播图数据
        this.isHeaderBlackColor = indexContent[0].children[0].children[0].name !== '2-W';
        this.productSwiperOneList = indexContent[0].children[1].children; // 产品轮播第一屏
        this.productSwiperTwoData = indexContent[0].children[2]; // 产品轮播第二屏
        this.productSwiperThreeData = indexContent[0].children[3]; // 产品轮播第三屏
        this.productWallList = indexContent[0].children[4].children || [];
      }
    },
    // 点击去详情
    handleProductClick (spuCodes) {
      if (!spuCodes) return;
      uni.navigateTo({
        url: `/subPackages/pdp/pages/pdp/index?code=${spuCodes}`,
      });
    },
    // 轮播图滚动  作用：标题替换
    swiperChange (e) {
      this.current = e.detail.current;
      this.isHeadBorder = this.current === 1;
      this.isHeadBlank = !(this.current === 1);
      this.isPause = this.current === 1;
    },
    animationfinish (e) {
      this.isShowDost = this.current === 0
    },
    // 首屏轮播图 滚动时 判断标题颜色
    homeHeaderSwiperChange (item) {
      this.isHeaderBlackColor = !(item.name === '2-W');
    },
    // 去隐私协议和通用服务 帮助中心详情页
    goHelpDetail (name, contentCode) {
      uni.navigateTo({
        url: `/subPackages/help/pages/help-detail/index?name=${name}&templateCode=help_content&contentCode=${contentCode}`,
      })
    },
    // 去plp页面
    goPlp (name, url, img = '') {
      console.log('goPlp', name, url, img);
      if (url) {
        uni.navigateTo({
          url: `/subPackages/plp/pages/plp/index?name=${name}&code=${url}&img=${img}`,
        })
      }
    },
    // 有数
    youshuReport (ysType, item) {
      console.log('youshuReport', ysType, item)
      this.$sr.track(ysType, {
        sku: {
          sku_id: item.code || 'TASAKI', // 若商品无sku_id时，可传spu_id信息
          sku_name: item.title || item.name || 'TASAKI', // 若商品无sku_name时，可传spu_name信息
        },
        spu: {
          spu_id: item.code || 'TASAKI', // 若商品无spu_id时，可传sku_id信息
          spu_name: item.title || item.name || 'TASAKI', // 若商品无spu_name时，可传sku_name信息
        },
        sale: {
          original_price: item.skus && item.skus.length > 0 ? item.skus[0].salePrice.amount : 0, // 对接智慧零售入口必传
          current_price: item.skus && item.skus.length > 0 ? item.skus[0].salePrice.amount : 0, // 对接智慧零售入口必传
        },
        primary_image_url: item.images && item.images.length > 0 ? item.images[0].url : (item.picLink
          || 'https://res-tasaki.baozun.com/static/images/account/account-bg2.png'),
      });
    },
    viewScroll (e) {
      // console.log("viewScroll",e.detail);
      this.viewScrollTop = e.detail.scrollTop;
      this.scrollToId = '';
    },
    fullscreenchange (scrollTop, isFullScreen) {
      console.log('isFullScreen', isFullScreen, scrollTop);
      if (!isFullScreen) {
        setTimeout(() => {
          this.scrollToId = 'seriesStory'
        }, 1000)
      }
      this.setTabBarHide(isFullScreen)
    },
    async wechatTrack (clickId) {
      console.log('wechatTrack123')
      try {
        // const token = await this.getAccessToken()
        const currentPage = getCurrentPages()[getCurrentPages().length - 1]
        await trackWechatAd({
          user_action_set_id: 1200031323, // 事先生成的数据源ID、写死
          actions: [{
            url: `http://wwww.qq.com${currentPage.$page.fullPath}`,
            action_time: parseInt((+new Date()) / 1000),
            action_type: 'VIEW_CONTENT',
            trace: {
              click_id: clickId,
            },
            user_id: {
              wechat_openid: uni.getStorageSync('openId'),
              wechat_app_id: 'wxe5bd54b04e85cd62',
            },
          }],
        })
      } catch (error) {
        console.error(error)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
.index {
  width: 100%;
  height: calc(100vh - 112rpx - var(--safe-area-inset-bottom));
  background: #fff;
  .swiper {
    height: calc(100vh - 112rpx - var(--safe-area-inset-bottom));
    background-color: #f7f7f7;
    .scroll-view {
      height: 100%;
    }
  }
}

</style>
<style lang="scss">
$mainColor: #e3f0ea;
// 底部隐私协议部分
.com-page-bottom {
  padding: 100rpx 0 80rpx;
  text-align: center;
  color: #000;
  .com-page-bottom-title {
    font-size: 28rpx;
    line-height: 42rpx;
  }
  .com-page-bottom-policy {
    font-size: 24rpx;
    line-height: 36rpx;
    margin-top: 40rpx;
    opacity: .5;
    text {
      line-height: 36rpx;
      position: relative;
      display: inline-block;
      height: 36rpx;
      margin: 0 10rpx;
      &::before {
        position: absolute;
        bottom: -2px;
        width: 100%;
        height: 1px;
        content: '';
        background-color: #000;
      }
    }
  }
}

</style>
