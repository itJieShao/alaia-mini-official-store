<template>
  <view v-if="viewData && Object.keys(viewData).length > 0" class="custom-swiper">
    <view class="title" v-if="title">{{ title }}</view>
      <swiper class="swiper" previous-margin="90rpx" next-margin="90rpx" :indicator-dots="false"
          :style="{'height': height}"
          :current="currentIndex">
          <swiper-item v-for="(swiper, index) in list" :key="index" @click="handleSwiperClick(swiper)">
            <image mode="widthFix" class="s-image" @load="handleLoadImg" :data-type="index" :src="$photoCompress(swiper.img)" :lazy-load="true"/>
            <view class="description">
              <view>{{ swiper.title1 }}</view>
              <view>{{ swiper.title2 }}</view>
            </view>
          </swiper-item>
      </swiper>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { get } from '../../utils/utilityOperationHelper'
import { navigateTo } from '../../utils/utils'
import { trackerCMSClick, EVENT_TYPE, SCREEN_NAME } from '../../utils/ga'
import { formatViewData } from '../../utils/cms'

export default {
  name: 'PLPSwiper',
  props: {
    promotion: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      heightList: [],
      currentIndex: 0,
    }
  },
  computed: {
    ...mapGetters('search', ['menuName']),
    title() {
      return get(this.viewData, 'title.title')
    },
    list() {
      return get(this.viewData, 'banner') || []
    },
    height() {
      return `${this.heightList[this.currentIndex]}rpx`
    },
    viewData() {
      return formatViewData(get(this.promotion, 'value'), {})
    },
  },
  methods: {
    handleLoadImg(e) {
      this.heightList.push(parseInt(get(e, 'detail.height')) + 200)
    },
    handleSwiperClick(item) {
      navigateTo(item.link)
      trackerCMSClick(this.promotion, {
        ...EVENT_TYPE.PLP_BTN,
        label: `点击${this.menuName}-${item.title2}`,
        screenName: this.isActivity ? SCREEN_NAME.ACTIVITY_PLP : SCREEN_NAME.PLP,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-swiper {
  font-size: 36rpx;
  text-align: center;
  color: #fff;
  .title {
    margin-bottom: 40rpx;
  }
  .s-image {
    display: block;
    margin-left: 20rpx;
    margin-bottom: 35rpx;
    width: 100%;
  }
}
</style>
