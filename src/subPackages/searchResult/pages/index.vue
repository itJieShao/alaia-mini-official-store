<template>
  <view class="search-result">
    <view class="title">搜索结果</view>
    <view class="product-list">
      <view class="product-item" v-for="(product, index) in searchProductResultList" :key="index">
        <productItem
          :product="{...product, gaIndex: index + 1}"
          className="plp-product-item"
          :isShowSize="true"
          :screenName="SCREEN_NAME.SEARCH"/>
      </view>
    </view>
    <view class="swiper">
      <customSwiper :promotion="{...bannerInfo, index: 1}"/>
    </view>
  </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import productItem from '../../../components/productItem'
import { get } from '../../../utils/utilityOperationHelper'
import customSwiper from '../../../components/plp/swiper'
import { CMS_MODULE } from '../../../constants/cms'
import { trackerProductImpression, SCREEN_NAME } from '../../../utils/ga'

export default {
  name: 'searchResult',
  components: {
    productItem,
    customSwiper,
  },
  data() {
    return {
      SCREEN_NAME,
      pageModuleList: [],
    }
  },
  computed: {
    ...mapGetters('search', ['searchProductResultList']),
    bannerInfo() {
      return this.pageModuleList.find((item) => item.module === CMS_MODULE.PLP_BANNER)
    },
  },
  onLoad() {
    this.getViewDataPLP('searchResult').then((list) => {
      this.pageModuleList = list
    })
  },
  onShow() {
    trackerProductImpression(this.searchProductResultList, SCREEN_NAME.SEARCH)
  },
  methods: {
    get,
    ...mapActions('cms', ['getViewDataPLP']),
  },
}
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
