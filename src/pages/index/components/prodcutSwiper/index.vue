<template>
  <view class="product-swiper">
    <view class="title">
      <com-title title="2022艺术的馈赠" subtitle="新品女士包袋" />
    </view>
    <view class="swiper-container">
      <swiper class="swiper" autoplay interval="3000" :current="currentIndex" @change="swiperChange" circular>
        <swiper-item class="swiper-item twoItem" v-for="i in 3" :key="i">
          <view class="goods-item" v-for="it in 2" :key="it">
          <!-- <view class="goods-item"> -->
            <image src="" mode="aspectFit" :lazy-load="true"></image>
            <view class="goods-label">
              新品
            </view>
            <text class="goods-title">镂空饺子包</text>
            <text class="goods-price">￥27,000</text>
          </view>
        </swiper-item>
      </swiper>
      <view class="left-side" @click="changeLeftSide">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_left.png"></image>
      </view>
      <view class="right-side" @click="changeRightSide">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_right.png"></image>
      </view>
      <view class="view-dost">
        <view class="swiper-dots-warp">
          <view class="swiper-dots" :style="{ width:dotsWidth + 'px',left:dotsLeft + 'px' }"></view>
        </view>
      </view>
      <view class="home-more-btn">
        <customButton :btnWidth="480" :btnHeight="80" className="transparent">即刻探索</customButton>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ComTitle from '../comTitle/comTitle';
  import customButton from '@/components/button/normal.vue';
  import { HOME_SUB_SWIPER_CONFIG } from '@/constants/cms';
  import { parseCmsContent } from '@/utils/cms';
  import { navigateTo } from '@/utils/utils';

  export default {
    data() {
      return {
        swiperList: [],
        content: {},
        currentIndex: 0,
      }
    },
    components: {
      ComTitle,
      customButton,
    },
    computed: {
      dotsWidth() {
        return this.swiperList.length > 0 ? 160 / this.swiperList.length : 160;
      },
      dotsLeft() {
        return this.swiperList.length > 0 ? 160 / this.swiperList.length * this.currentIndex : 0;
      },
      ...mapGetters('cms', ['cmsContentMap'])
    },
    watch: {
      cmsContentMap (newValue) {
        // todo : 需要绑定数据
        this.content = this.getCmsContentData(newValue, HOME_SUB_SWIPER_CONFIG, 'content');
        console.log('content-------> ', this.content);
        this.swiperList = this.getCmsContentData(newValue, HOME_SUB_SWIPER_CONFIG, 'swiper_group');
        console.log('swiperList-------> ', this.swiperList);
      }
    },
    methods: {
      navigateTo,
      getCmsContentData (resData, config, name) {
        const { moduleCode, contentCode } = config;
        try {
         return parseCmsContent(resData[contentCode], name, moduleCode);
        } catch (error) {
          console.error(error)
        }
      },
      swiperChange(e) {
        this.currentIndex = e.detail.current;
      },
      changeLeftSide() {
        this.currentIndex = this.currentIndex > 0 ? --this.currentIndex : this.swiperList.length - 1;
      },
      changeRightSide() {
        this.currentIndex = this.currentIndex === this.swiperList.length - 1 ? 0 : ++this.currentIndex;
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import './index';
</style>
