<template>
  <view v-if="viewData && Object.keys(viewData).length > 0" class="select-series">
    <view class="title">
      {{ title }}
    </view>
    <view class="list">
      <view class="item" v-for="(item, index) in list" :key="index" @click="handleItemClick(item.link, item.title2)">
        <image class="img" mode="scaleToFill" :src="$photoCompress(item.img)"/>
        <view class="info">
          <view class="first">{{ item.title1 }}</view>
          <view class="second">{{ item.title2 }}</view>
          <view class="third">{{ item.title3 }}</view>
        </view>
      </view>
    </view>
    <view class="last-model" v-if="Object.keys(lastModel).length > 0" @click="handleItemClick(lastModel.link, lastModel.title2)">
      <view class="wrapper">
        <view class="txt-title1">{{ lastModel.title1 }}</view>
        <view class="txt-title2">{{ lastModel.title2 }}</view>
        <view class="txt-title3">{{ lastModel.title3 }}</view>
      </view>
      <image mode="widthFix" class="img" :src="$photoCompress(lastModel.img, 400)"/>
    </view>
  </view>
</template>

<script>
import { navigateTo } from '../../utils/utils'
import { trackerCMSClick, EVENT_TYPE, SCREEN_NAME } from '../../utils/ga'
import { formatViewData } from '../../utils/cms'
import { get } from '../../utils/utilityOperationHelper'

export default {
  name: 'selectSeries',
  props: {
    promotion: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    title() {
      return this.viewData && this.viewData.title && this.viewData.title.text
    },
    originList() {
      return (this.viewData && this.viewData.info) || []
    },
    list() {
      if (this.originList.length > 4) {
        return this.originList.slice(0, 4)
      }
      return this.originList;
    },
    lastModel() {
      if (this.originList.length > 4) {
        return this.originList[4]
      }
      return {}
    },
    viewData() {
      return formatViewData(get(this.promotion, 'value'), {})
    },
  },
  methods: {
    handleItemClick(url, title) {
      navigateTo(url)
      trackerCMSClick(this.promotion, { ...EVENT_TYPE.INDEX_BTN, label: `点击${this.title}-${title}`, screenName: SCREEN_NAME.INDEX })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
