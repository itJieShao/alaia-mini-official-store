<template>
  <view v-if="viewData && Object.keys(viewData).length > 0" class="welcome-appoint">
    <view class="title">{{ title }}</view>
    <!-- <rich-text class="content" :nodes="richtext"></rich-text> -->
    <view class="content">
      <view v-for="(c, index) in contents" :key="index">{{ c.title }}</view>
    </view>
    <view class="btn">
      <appointButton :width="btnInfo.width" className="transparent" @click="handleClick">{{ btnInfo.text }}</appointButton>
    </view>
    <!-- <view class="tips">*仅代表品牌美学理念与科研动力，无关产品功效。</view> -->
  </view>
</template>

<script>
import appointButton from '../appointBtn'
import { trackerCMSClick, EVENT_TYPE, SCREEN_NAME } from '../../utils/ga'
import { formatViewData } from '../../utils/cms'
import { get } from '../../utils/utilityOperationHelper'

export default {
  name: 'welcomeAppoint',
  props: {
    promotion: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    appointButton,
  },
  computed: {
    viewData() {
      return formatViewData(get(this.promotion, 'value'), {})
    },
    title() {
      return this.viewData && this.viewData.title && this.viewData.title.text
    },
    contents() {
      return (this.viewData && this.viewData.titles) || []
    },
    btnInfo() {
      return this.viewData && this.viewData.button
    },
  },
  methods: {
    handleClick() {
      trackerCMSClick(this.promotion, { ...EVENT_TYPE.INDEX_BTN, label: `点击${this.title}-${this.btnInfo.text}`, screenName: SCREEN_NAME.INDEX })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
