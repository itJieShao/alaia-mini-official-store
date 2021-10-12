<template>
  <view>
    <view v-if="spuCodeList && spuCodeList.length > 0" :class="['new-product-list', className]">
      <view v-if="title" class="title">{{ title }}</view>
      <view v-else class="empty"></view>
      <view class="product-list">
        <view class="item" v-for="(product, index) in productList" :key="index">
          <productItem
            :product="{...product, gaIndex: index + 1}"
            :speceilStr="getIsSpecailStr(product)"
            :otherSpeceilStr="getOtherSpceial(index)"
            :className="(isPlp || isActivity) && 'plp-product-item'"
            :isShowSpecialStr="isPlp || isActivity"
            :screenName="screenName"/>
        </view>
      </view>
      <view :class="['btn', {'empty-btn': !btnInfo.text}]">
        <template v-if="btnInfo.text">
          <appointButton v-if="isPlp" :width="btnInfo.width" :className="btnClassName" @click="handleTrackerClick">{{ btnInfo.text }}</appointButton>
          <customButton v-else :width="btnInfo.width" :className="btnClassName" @click="handleLink(btnInfo.link)">{{ btnInfo.text }}</customButton>
        </template>
      </view>
    </view>
    <view v-else-if="(!spuCodeList || spuCodeList.length === 0) && className" :class="['new-product-list', className]">
      <view :class="['btn', {'empty-btn': !btnInfo.text}]">
        <template v-if="btnInfo.text">
          <appointButton v-if="isPlp" :width="btnInfo.width" :className="btnClassName" @click="handleTrackerClick">{{ btnInfo.text }}</appointButton>
          <customButton v-else :width="btnInfo.width" :className="btnClassName" @click="handleLink(btnInfo.link)">{{ btnInfo.text }}</customButton>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import productItem from '../productItem'
import customButton from '../button/normal.vue'
import appointButton from '../appointBtn'
import { get } from '../../utils/utilityOperationHelper'
import { navigateTo } from '../../utils/utils'
import {
  trackerCMSClick, EVENT_TYPE, trackerProductImpression, SCREEN_NAME,
} from '../../utils/ga'
import { formatViewData } from '../../utils/cms'
import { getSpecialStr } from '../../utils/product'
import { PRODUCT_LIST_SOURCE } from '../../constants/product'

export default {
  components: {
    productItem,
    customButton,
    appointButton,
  },
  props: {
    // plp-product-list
    className: {
      type: String,
      default: '',
    },
    btnClassName: {
      type: String,
      default: 'transparent',
    },
    isShowSize: {
      type: Boolean,
      default: false,
    },
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
      default: SCREEN_NAME.INDEX,
    },
  },
  data() {
    return {
      productList: [],
    }
  },
  computed: {
    ...mapGetters('search', ['menuName']),
    ...mapGetters('cms', ['pageCode']),
    viewData() {
      return formatViewData(get(this.promotion, 'value'), {})
    },
    title() {
      return this.viewData && this.viewData.title && this.viewData.title.text
    },
    spuCodeList() {
      const list = this.viewData && this.viewData.product && this.viewData.product.goodssel
      if (list) {
        return list.split(',')
      }
      return []
    },
    btnInfo() {
      return (this.viewData && this.viewData.button) || {}
    },
    isPlp() {
      return this.source === PRODUCT_LIST_SOURCE.PLP
    },
    isActivity() {
      return this.source === PRODUCT_LIST_SOURCE.ACTIVITY
    },
  },
  watch: {
    spuCodeList: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.getProductList(this.spuCodeList).then((list) => {
            this.productList = list
            trackerProductImpression(this.productList, this.screenName)
          }).finally(() => {
            this.$emit('finish')
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions('product', ['getProductList']),
    getSpecialStr,
    handleLink(url) {
      navigateTo(url)
      this.handleTrackerClick()
    },
    handleTrackerClick() {
      let label = '点击'
      if (this.title) {
        label += `${this.title}系列`
      } else {
        label += this.menuName
      }
      label += `-${this.btnInfo.text}`
      const eventObj = this.pageCode === 'index' ? EVENT_TYPE.INDEX_BTN : EVENT_TYPE.PLP_BTN
      trackerCMSClick(this.promotion, { ...eventObj, label, screenName: this.screenName })
    },
    getIsSpecailStr(product) {
      if (this.isPlp || this.isActivity) {
        return getSpecialStr(product)
      }
      return ''
    },
    getOtherSpceial(index) {
      if (!this.isPlp && !this.isActivity) return ''
      if (index % 2) {
        return getSpecialStr(this.productList[index - 1])
      }
      return getSpecialStr(this.productList[index + 1])
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";

</style>
