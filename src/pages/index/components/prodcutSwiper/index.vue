<template>
  <view class="product-swiper">
    <view class="title">
      <com-title :title="content.title" :subtitle="content.sub_title" />
    </view>
    <view class="swiper-container">
      <swiper class="swiper" autoplay interval="3000" :current="currentIndex" @change="swiperChange" circular>
        <swiper-item class="swiper-item" :class="content.per_view == 2?'twoItem':'oneItem'"
          v-for="(item,index) in swiperList" :key="index">
          <view @click="goPdp(it.code)" class="goods-item"
            :style="content.per_view == 2?'width: 330rpx;':'width: 430rpx;'" v-for="(it,itd) in item" :key="itd">
            <image :src="it.images[0].url" mode="aspectFit" :lazy-load="true"></image>
            <view class="goods-label">
              新品
            </view>
            <view class="goods-title" v-if="it.title">{{it.title}}</view>
            <view class="goods-price" v-if="it.skus &&　it.skus.length>0 &&　it.skus[0].salePrice.amount">¥
              {{it.skus[0].salePrice.amount | formatMoney}}</view>
          </view>
        </swiper-item>
      </swiper>
      <!-- <view class="left-side" @click="changeLeftSide">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_left.png"></image>
      </view>
      <view class="right-side" @click="changeRightSide">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_right.png"></image>
      </view> -->
      <view class="view-dost">
        <view class="swiper-dots-warp">
          <view class="swiper-dots" :style="{ width:dotsWidth + 'px',left:dotsLeft + 'px' }"></view>
        </view>
      </view>
      <view class="home-more-btn">
        <customButton v-if="content.has_button"  @click="() => navigateTo(content.link)" :btnWidth="480" :btnHeight="80" className="transparent">
          {{content.button_txt?content.button_txt:'即刻探索'}}
        </customButton>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex';
  import ComTitle from '../comTitle/comTitle';
  import customButton from '@/components/button/normal.vue';
  import {
    HOME_SUB_SWIPER_CONFIG
  } from '@/constants/cms';
  import {
    parseCmsContent
  } from '@/utils/cms';
  import {
    navigateTo,
    priceFormat
  } from '@/utils/utils';
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
    filters: {
      formatMoney(val) {
        if (val) {
          return priceFormat(val);
        }
        return '0';
      },
    },
    watch: {
      cmsContentMap(newValue) {
        // todo : 需要绑定数据
        const content = this.getCmsContentData(newValue, HOME_SUB_SWIPER_CONFIG, 'content');
        const contentData = content[0];
        const swiperList = this.getCmsContentData(newValue, HOME_SUB_SWIPER_CONFIG, 'swiper_group');
        const codes = swiperList.map(item => item.spu_code);
        this.getProductList(codes).then((res) => {
          const arr = [];
          for (let i = 0; i < res.length;) {
            arr.push(res.slice(i, i += Number(contentData.per_view)));
          }
          this.swiperList = arr;
        })
        this.content = contentData;
      }
    },
    methods: {
      navigateTo,
      ...mapActions('product', ['getProductList']),
      getCmsContentData(resData, config, name) {
        const {
          moduleCode,
          contentCode
        } = config;
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
      goPdp(code) {
        if (code) {
          this.$emit('handleProductClick', code);
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import './index';
</style>
