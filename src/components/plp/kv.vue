<template>
  <view v-if="viewData && viewData.length > 0" :class="['kv', {'active': isActivity}]">
    <!-- v-for="(item, index) in viewData" :key="index" -->
    <view :class="['item', kvData.position]"
      @click="handleClick(kvData)">
      <image id="image" mode="widthFix" data-type="0" class="image" :src="$photoCompress(kvData.img)"/>
      <view class="titles">
        <rich-text class="title1" v-if="kvData.title1" :nodes="kvData.title1"></rich-text>
        <rich-text class="title2" v-if="kvData.title2" :nodes="kvData.title2"></rich-text>
        <rich-text class="title3" v-if="kvData.title3" :nodes="kvData.title3"></rich-text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { navigateTo } from '../../utils/utils'
import { get } from '../../utils/utilityOperationHelper'
import { trackerCMSClick, EVENT_TYPE, SCREEN_NAME } from '../../utils/ga'
import { formatViewData } from '../../utils/cms'

export default {
  props: {
    // 是否用于活动页面
    isActivity: {
      type: Boolean,
      default: false,
    },
    promotion: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters('search', ['menuName']),
    kvData() {
      return this.viewData[0] || {}
    },
    viewData() {
      return formatViewData(get(this.promotion, 'value'), [])
    },
  },
  methods: {
    handleClick(item) {
      navigateTo(item.link)
      trackerCMSClick(this.promotion, {
        ...EVENT_TYPE.PLP_BTN,
        label: `点击${this.menuName}-${this.kvData.title1}`,
        screenName: this.isActivity ? SCREEN_NAME.ACTIVITY_PLP : SCREEN_NAME.PLP,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.kv {
  position: relative;
  .image {
    z-index: -1;
    width: 750rpx;
  }
  .item {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    color: #fff;
    .titles {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      bottom: 52rpx;
      .title1, .title2 {
        font-size: 50rpx;
      }
      .title3 {
        font-size: 28rpx;
        letter-spacing: 3rpx;
        color: #B5B5B5;
        text-align: center;
        line-height: 1.5;
      }
      .title3::before {
        content: "";
        display: block;
        width: 110rpx;
        height: 2rpx;
        background-color: #B5B5B5;
        margin: 34rpx auto;
      }
    }
    &.center {
      .titles {
        margin-bottom: auto;
        margin-top: auto;
      }
    }
    &.top {
      .titles {
        margin-bottom: auto;
        margin-top: 52rpx;
      }
    }
  }
}
.active {
  .item {
    font-family: 'HelveticaNeueLTPro-Lt';
    .title1, .title2 {
      font-weight: 400;
      text-transform: uppercase;
      line-height: 60rpx;
    }
    .title3 {
      margin-bottom: 60rpx;
      font-size: 32rpx;
      color: #fff;
    }
    .title3::before {
      height: 4rpx;
      width: 90rpx;
      background-color: #969696;
      margin: 25rpx auto;
    }
  }
}
</style>
