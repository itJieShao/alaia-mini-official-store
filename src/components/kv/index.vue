<template>
  <view class="kv" v-if="viewData && viewData.length > 0">
    <swiper class="swiper"
      :current="currentIndex"
      :style="{height: `${swiperHeightList[0]}px`}"
      :circular="true"
      :autoplay="true"
      :interval="3000"
      @change="handleChange">
      <swiper-item class="swiper-item" v-for="(item, index) in viewData" :key="index">
        <view class="wrapper" :id="`swiper-item-${index}`" @click="handleItemClick(item)">
         <view class="img-wrapper">
           <image class="img" mode="widthFix" :src="$photoCompress(item.img)" alt="" @load="handleImgLoad(index)">
         </view>
          <view class="title">
            <view class="first" v-if="item.title1 ">{{ item.title1 }}</view>
            <view class="second" v-if="item.title2">{{ item.title2 }}</view>
            <view class="third" v-if="item.title3">{{ item.title3 }}</view>
            <view v-if="item.title4" class="forth">{{ item.title4 }}</view>
          </view>
          <view class="btn" v-if="item.btn_text">
            <customButton
              :width="item.btn_width"
              className="transparent"
              @click="handleLink(item.btn_link, item.btn_text)">
              {{ item.btn_text }}
            </customButton>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <!-- 指示器 start -->
    <view v-if="viewData.length > 1" class="custom-indicator">
      <view v-for="d in viewData.length" @click="handleIndicatorClick(d)"
      :class="['indicator-item', {'active': d === currentIndex}]" :key="d"></view>
    </view>
    <view v-else class="space"></view>
    <!-- 指示器 end -->
  </view>
</template>

<script>
import { navigateTo } from '../../utils/utils'
import customButton from '../button/normal.vue'
import { trackerCMSClick, EVENT_TYPE, SCREEN_NAME } from '../../utils/ga'
import { formatViewData } from '../../utils/cms'
import { get } from '../../utils/utilityOperationHelper'

export default {
  name: 'kv',
  components: {
    customButton,
  },
  props: {
    promotion: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      swiperHeightList: [],
      currentIndex: 0,
    }
  },
  computed: {
    viewData() {
      return formatViewData(get(this.promotion, 'value'), [])
    },
  },
  methods: {
    handleLink(url, btnTxt) {
      navigateTo(url)
      trackerCMSClick(this.promotion, { ...EVENT_TYPE.INDEX_BTN, label: btnTxt || '点击臻美底妆系列-即可选购', screenName: SCREEN_NAME.INDEX })
    },
    handleImgLoad(index) {
      const query = uni.createSelectorQuery().in(this);
      query.select(`#swiper-item-${index}`).boundingClientRect((data) => {
        if (data && data.height) {
          this.swiperHeightList.push(data.height)
        }
      }).exec();
    },
    handleChange(e) {
      if (e && e.detail) {
        this.currentIndex = e.detail.current
      }
    },
    handleItemClick(item) {
      if (!item || item.btn_width) return
      this.handleLink(item.btn_link, item.btn_text)
    },
    handleIndicatorClick(index) {
      if (index === this.currentIndex) return
      this.currentIndex = index
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
