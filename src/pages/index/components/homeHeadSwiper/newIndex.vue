<template name="homeHeadSwiper">
  <view class="home-head-swiper">
    <swiper class="swiper" :circular="true">
      <block v-for="(swiperItem,swiperIndex) in bannerList" :key="swiperIndex">
        <swiper-item class="home-head-swiper-item fontWhite">
          <!-- 图片 -->
          <block v-if="swiperItem.source_type === 'image'">
            <image class="home-head-swiper-img" v-if="swiperItem.source_url" :src="swiperItem.source_url" mode="aspectFill" :lazy-load="true" />
          </block>
          <!-- 视频 -->
          <block v-else>
            <view class="home-head-swiper-video">
              <video class="video-content" v-if="swiperItem.source_url" :id="'myVideo'+swiperIndex" :src="swiperItem.source_url" :loop="false" autoplay :controls="false" object-fit ="cover"  :show-mute-btn="true" :show-center-play-btn="false" :show-play-btn="false" :show-fullscreen-btn="false" play-btn-position="center" :enable-progress-gesture="false"></video>
            </view>
          </block>

          <view class="home-head-swiper-other">
            <view class="home-head-swiper-title" v-if="swiperItem.title"><text>{{swiperItem.title}}</text></view>
            <customButton class="home-head-swiper-btn" v-if="swiperItem.has_button" @click="goPlp(swiperItem.title,swiperItem.link)" :btnWidth="400" :btnHeight="80" className="whiteBtn">{{swiperItem.button_txt || '探索更多'}}</customButton>
          </view>

        </swiper-item>
      </block>
    </swiper>
    <view class="view-dost white-dost" v-if="bannerList.length > 1">
      <view class="swiper-dots-warp">
        <view class="swiper-dots"  :style="{ width:dotsWidth + 'px',left:dotsLeft + 'px' }"></view>
      </view>
    </view>
    <view class="down-arrow" v-if="bannerList.length > 0">
      <text class="icon-font icon-zhankai white-arrow"></text>
      <text class="icon-font icon-zhankai white-arrow"></text>
    </view>
    <view class="news-toast" :style="newsShow?'opacity:1;':'opacity:0;'">
      <text class="icon-font icon-guanbi" @click="newsShow = false"></text>
      <swiper class="news-toast-swiper" circular autoplay interval="3000">
        <swiper-item v-for="i in 2" :key="i">
          <view>2021年秋冬系列，隆重登场</view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import customButton from '@/components/button/normal.vue';
import { getCmsContent } from '@/service/apis';
import { parseCmsContent } from '@/utils/cms';
import { HOME_MAIN_SWIPER_CONFIG } from '@/constants/cms';

export default {
  name: 'homeHeadSwiper',
  components: {
    customButton,
  },
  props: {

  },
  watch: {

  },
  data() {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight, // 头部的高度，用于设置样式padding-top
      bannerList: [], // 轮播图数据
      currentIndex: 0, // 轮播图所属下标
      newsShow: true,
    };
  },
  computed: {
    dotsWidth() {
      return this.bannerList.length > 0 ? 240 / this.bannerList.length : 240;
    },
    dotsLeft() {
      return this.bannerList.length > 0 ? 240 / this.bannerList.length * this.currentIndex : 0;
    },
  },
  mounted() {
    this.getMainSwiper();
  },
  methods: {
    async getMainSwiper() {
      const { moduleCode, ...rest } = HOME_MAIN_SWIPER_CONFIG;
      try {
        const res = await getCmsContent({ ...rest });
        const mainSwiperData = parseCmsContent(res, moduleCode, moduleCode);
        console.log('mainSwiperData------>', mainSwiperData);
        mainSwiperData.forEach(item => {
          if (item.source_url) {
            const re = new RegExp("^(http|https)://");
            if (!re.test(item.source_url)) {
              item.source_url = "https://" + item.source_url
            }
          }
        })
        this.bannerList = mainSwiperData;
      } catch (error) {
        console.error(error)
      }
    },
    swiperChange(e) {
      this.currentIndex = e.detail.current;
      this.$emit('swiperChange', this.bannerList[this.currentIndex]);
    },
    // 去plp页面
    goPlp(name, url) {
      console.log('goPlp', url);
      if (url) {
        uni.navigateTo({
          url: `/subPackages/plp/pages/plp/index?name=${name}&code=${url}&img=`,
        })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import './index';
</style>
