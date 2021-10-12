<template>
  <view class="search-list">
    <view class="hot-title">热门产品</view>
    <view v-for="(product, index) in showProductList" :key="product.code">
      <view class="product-item" @click="handleClickDetail(product, index)">
        <view class="image">
          <image class="img" :src="$photoCompress(get(product, 'images[1].url'))"/>
        </view>
        <view class="info">
          <view class="category">{{ getCategory(product) }}</view>
          <view class="subTitle" v-if="get(product, 'subTitle')">{{ get(product, 'subTitle') || '' }}</view>
          <view class="title" v-if="get(product, 'title')">{{ get(product, 'title') || '' }}</view>
          <view class="price">￥{{ priceFormat(get(product, 'salePrice.amount')) }}</view>
        </view>
      </view>
    </view>
    <view class="view-more" v-if="isShowMore" @click="handleViewMore">
      <text @click="handleCheckResult">查看全部结果</text>
      <!-- <image class="view-icon" :src="require('../../assets/images/icon/back.png')"/> -->
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/utilityOperationHelper'
import { priceFormat, navigateTo } from '../../utils/utils'
import { getCategory } from '../../utils/product'
import { trackerClickProduct, EVENT_TYPE, SCREEN_NAME } from '../../utils/ga'

export default {
  name: 'SearchList',
  props: {
    productList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isShowMore() {
      return this.productList && this.productList.length > 3
    },
    showProductList() {
      return this.productList.slice(0, 3)
    },
  },
  methods: {
    get,
    priceFormat,
    getCategory,
    handleViewMore() {},
    handleClickDetail(product, index) {
      this.$emit('close')
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/pdp/index?code=${get(product, 'code')}`,
        })
      }, 300);
      trackerClickProduct({ ...product, gaIndex: index + 1 }, {
        listName: '搜索结果列表',
        screenName: SCREEN_NAME.SEARCH,
        event: EVENT_TYPE.PLP_PRODUCT,
      })
    },
    handleCheckResult() {
      this.$emit('close')
      setTimeout(() => {
        navigateTo('/subPackages/searchResult/pages/index')
      }, 300);
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
