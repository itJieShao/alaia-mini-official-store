<template>
  <view class="index">
    <custom-nav-bar :left-icon="'search'" :left-text="'搜索'" :head-border="false" :head-blank="isHeadBlank"
      :head-font-color="isHeaderBlackColor" />
    <!-- page Container -->
    <view class="container">
      <swiper class="swiper" :current="current" easing-function="linear" :autoplay="false" :indicator-dots="false"
        :vertical="true" @change="swiperChange" @animationfinish="animationfinish">
        <swiper-item class="scroll-view">
          <!-- 首页顶部swiper -->
          <home-head-swiper :pageIsShow="pageIsShow" :parentCurrent="current" :isPause="isPause"
            :isShowDost="isShowDost"></home-head-swiper>
        </swiper-item>
        <swiper-item>
          <scroll-view scroll-y class="scroll-view scroll-view-content" :style="{'paddingTop':ktxStatusHeight}"
            @scroll="viewScroll" :scroll-into-view="scrollToId">
            <product-swiper></product-swiper>
            <product-model></product-model>
            <product showTab ></product>
            <view style="padding-top: 50rpx;background-color: #fff;">
              <customButton :btnWidth="480" :btnHeight="80" className="transparent">即刻探索</customButton>
            </view>
            <product></product>
            <view style="padding-top: 50rpx;background-color: #fff;">
              <customButton :btnWidth="480" :btnHeight="80" className="transparent">即刻探索</customButton>
            </view>
            <!-- 品牌故事 -->
            <section-content :config="HOME_BRAND_INTRO_CONFIG"></section-content>
            <!-- 精品店 -->
            <view style="padding-bottom: 110rpx;background-color: #fff;">
              <section-content :config="HOME_STORE_CONFIG"></section-content>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex';
  import { trackWechatAd } from '@/service/apis'
  import customButton from '@/components/button/normal.vue';
  import HomeHeadSwiper from './components/homeHeadSwiper/index'; // 首页顶部swiper
  import ProductSwiper from './components/prodcutSwiper/index'; // 首页轮播
  import ProductModel from './components/productModel/productModel'; // 造型灵感
  import Product from './components/product/product'; // 精选推荐
  import SectionContent from './components/sectionContent'; // 精品店
  import { HOME_STORE_CONFIG, HOME_BRAND_INTRO_CONFIG } from '@/constants/cms';


  export default {
    name: 'index',
    components: {
      HomeHeadSwiper,
      ProductSwiper,
      ProductModel,
      Product,
      customButton,
      SectionContent
    },
    data() {
      return {
        ktxStatusHeight: getApp().globalData.ktxStatusHeight, // 头部的高度，用于设置样式padding-top
        isHeadBorder: false, // header border是否展示
        isHeadBlank: true, // header 是否透明
        isHeaderBlackColor: false, // header 字体颜色
        productWallList: [], // 产品墙数据
        current: 0, // swiper 当前下表
        isPause: false, // 是否要暂停首页视频
        viewScrollTop: '',
        scrollToId: '',
        pageIsShow: false,
        isShowDost: true,
        HOME_STORE_CONFIG,
        HOME_BRAND_INTRO_CONFIG
      };
    },
    // 分享配置项
    onShareAppMessage(res) {
      return {
        title: 'ALAIA',
        path: 'pages/index/index',
        imageUrl: '',
        success() {},
      };
    },
    async onShow() {
      this.pageIsShow = true;
      this.setTabSelected(0);
      const advertising = uni.getStorageSync('advertisingParam') || this.advertisingParam;
      if (advertising && advertising.gdt_vid) {
        this.wechatTrack(advertising.gdt_vid);
      }
      await this.getCmsContentMapData();
    },
    onHide() {
      this.pageIsShow = false;
      console.log('首页', this.pageIsShow)
    },
    onPullDownRefresh() {
      wx.stopPullDownRefresh(); // 阻止下拉刷新
    },
    methods: {
      ...mapActions('cms', ['getCmsContentMapData']),
      ...mapActions('category', ['getCategoryData']),
      ...mapActions('common', ['getAccessToken']),
      ...mapState('globle', ['advertisingParam']),
      ...mapMutations('globle', ['setTabBarHide', 'setTabSelected']),
      ...mapActions('user', ['getUserInfo']),
      // 点击去详情
      handleProductClick(spuCodes) {
        if (!spuCodes) return;
        uni.navigateTo({
          url: `/subPackages/pdp/pages/pdp/index?code=${spuCodes}`,
        });
      },
      // 轮播图滚动  作用：标题替换
      swiperChange(e) {
        this.current = e.detail.current;
        this.isHeadBorder = this.current === 1;
        this.isHeaderBlackColor = this.current === 1;
        this.isHeadBlank = !(this.current === 1);
        this.isPause = this.current === 1;
      },
      animationfinish(e) {
        this.isShowDost = this.current === 0
      },
      // 首屏轮播图 滚动时 判断标题颜色
      homeHeaderSwiperChange(item) {
        this.isHeaderBlackColor = !(item.name === '2-W');
      },
      // 去隐私协议和通用服务 帮助中心详情页
      goHelpDetail(name, contentCode) {
        uni.navigateTo({
          url: `/subPackages/help/pages/help-detail/index?name=${name}&templateCode=help_content&contentCode=${contentCode}`,
        })
      },
      // 去plp页面
      goPlp(name, url, img = '') {
        console.log('goPlp', name, url, img);
        if (url) {
          uni.navigateTo({
            url: `/subPackages/plp/pages/plp/index?name=${name}&code=${url}&img=${img}`,
          })
        }
      },
      // 有数
      youshuReport(ysType, item) {
        console.log('youshuReport', ysType, item)
        this.$sr.track(ysType, {
          sku: {
            sku_id: item.code || 'ALAIA', // 若商品无sku_id时，可传spu_id信息
            sku_name: item.title || item.name || 'ALAIA', // 若商品无sku_name时，可传spu_name信息
          },
          spu: {
            spu_id: item.code || 'ALAIA', // 若商品无spu_id时，可传sku_id信息
            spu_name: item.title || item.name || 'ALAIA', // 若商品无spu_name时，可传sku_name信息
          },
          sale: {
            original_price: item.skus && item.skus.length > 0 ? item.skus[0].salePrice.amount : 0, // 对接智慧零售入口必传
            current_price: item.skus && item.skus.length > 0 ? item.skus[0].salePrice.amount : 0, // 对接智慧零售入口必传
          },
          primary_image_url: item.images && item.images.length > 0 ? item.images[0].url : (item.picLink ||
            'https://scm-dam.oss-cn-shanghai.aliyuncs.com/scm-dam/2021-10-22/0.20207557526373865%E4%BD%8D%E5%9B%BE.jpg'),
        });
      },
      viewScroll(e) {
        // console.log("viewScroll",e.detail);
        this.viewScrollTop = e.detail.scrollTop;
        this.scrollToId = '';
      },
      fullscreenchange(scrollTop, isFullScreen) {
        console.log('isFullScreen', isFullScreen, scrollTop);
        if (!isFullScreen) {
          setTimeout(() => {
            this.scrollToId = 'seriesStory'
          }, 1000)
        }
        this.setTabBarHide(isFullScreen)
      },
      async wechatTrack(clickId) {
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
  @import './index';
</style>
