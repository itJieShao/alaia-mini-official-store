<template>
  <view v-if="viewData && Object.keys(viewData).length > 0" :class="['titles', {'activity': isActivity}]">
    <view class="title">
      <view v-for="(title, index) in titles" :key="index">{{ title.text }}</view>
    </view>
    <view v-if="descriptionList && descriptionList.length > 0" class="description">
      <view class="txt" v-for="(description, index) in descriptionList" :key="index">{{ description }}</view>
    </view>
    <view class="product-list">
      <productList className="plp-product-list"
                  :source="source"
                  :btnClassName="isActivity ? 'big-btn' : 'mini-btn'"
                  :index="index"
                  :promotion="promotion"
                  :screenName="screenName"/>
    </view>
  </view>
</template>

<script>
import productList from '../productList'
import { formatViewData } from '../../utils/cms'
import { get } from '../../utils/utilityOperationHelper'
import { SCREEN_NAME } from '../../utils/ga'
import { PRODUCT_LIST_SOURCE } from '../../constants/product'

export default {
  components: {
    productList,
  },
  props: {
    source: {
      type: String,
      default: PRODUCT_LIST_SOURCE.PLP,
    },
    promotion: {
      type: Object,
      default: () => {},
    },
    screenName: {
      type: String,
      default: SCREEN_NAME.PLP,
    },
  },
  computed: {
    viewData() {
      return formatViewData(get(this.promotion, 'value'), {})
    },
    list() {
      return this.viewData && this.viewData.titles || []
    },
    titles() {
      if (this.list.length >= 2) {
        return this.list.slice(0, this.list.length - 1)
      }
      return this.list
    },
    descriptionList() {
      let description = {}
      if (this.list.length >= 2) {
        description = this.list[this.list.length - 1]
      }
      if (description.text && description.text.length > 0) {
        return (description.text || '').split(/<br>|<br \/>|<br >/g)
      }
      return []
    },
    product() {
      return (this.viewData && this.viewData.product) || {}
    },
    isActivity() {
      return this.source === PRODUCT_LIST_SOURCE.ACTIVITY
    },
  },
}
</script>

<style lang="scss" scoped>
.titles{
  box-sizing: border-box;
  .title {
    padding: 0 35rpx;
    margin-top: 70rpx;
    font-size: 50rpx;
    color: #fff;
    display: block;
  }
  .description::before {
    content: "";
    display: block;
    width: 90rpx;
    height: 4rpx;
    background-color: #969696;
    margin-top: 40rpx;
  }
  .description {
    padding: 0 35rpx;
    .txt {
      margin-top: 40rpx;
      display: block;
      font-size: 35rpx;
      color: #B5B5B5;
      letter-spacing: 1rpx;
    }
  }
  .product-list {
    padding: 50rpx 0;
  }
}
.activity {
  margin-bottom: 24rpx;
  font-family: 'HelveticaNeueLTPro-Lt';
  .title {
    margin-top: 32rpx;
    text-align: center;
  }
  .description::before {
    height: 0;
    height: 0;
  }
  .description {
    .txt {
      color: #fff;
      letter-spacing: -1px;
      line-height: 50rpx;
    }
  }
}
</style>
