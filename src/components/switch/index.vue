<template>
  <view class="switch" v-if="viewData && viewData.length > 0">
    <view class="head">
      <view v-for="(item, index) in viewData"
        :key="index"
        :class="['title',{'active': index === activeIndex}]"
        @click="handleActiveClick(index, item.laprairie_index02_title)">{{ item.laprairie_index02_title }}</view>
    </view>
    <view class="content">
      <template v-for="(item, index) in viewData">
        <view :class="['wrapper',{'active': index === activeIndex}]" :key="item.laprairie_index02_img">
          <image @click="handleClick(item.laprairie_index02_btn_link)" mode="widthFix" :src="$photoCompress(item.laprairie_index02_img)"/>
          <view class="btn" v-if="item.laprairie_index02_btn_text">
            <customButton
              :width="item.laprairie_index02_btn_width"
              className="transparent"
              @click="handleClick(item.laprairie_index02_btn_link)"
            >
              {{ item.laprairie_index02_btn_text }}
            </customButton>
          </view>
        </view>
      </template>
    </view>

  </view>
</template>

<script>
import customButton from '../button/normal.vue'
import { navigateTo } from '../../utils/utils'
import { trackerCMSClick, EVENT_TYPE, SCREEN_NAME } from '../../utils/ga'
import { formatViewData } from '../../utils/cms'
import { get } from '../../utils/utilityOperationHelper'

export default {
  name: 'Switch',
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
      activeIndex: 0,
    }
  },
  computed: {
    viewData() {
      return formatViewData(get(this.promotion, 'value'), [])
    },
  },
  methods: {
    handleActiveClick(index, txt) {
      this.activeIndex !== index && (this.activeIndex = index)
      this.tracker(`${txt}系列`)
    },
    handleClick(url, txt) {
      navigateTo(url)
      this.tracker(`${txt}-${url}`)
    },
    tracker(txt) {
      trackerCMSClick(this.promotion, { ...EVENT_TYPE.INDEX_BTN, label: `点击${txt}`, screenName: SCREEN_NAME.INDEX })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
