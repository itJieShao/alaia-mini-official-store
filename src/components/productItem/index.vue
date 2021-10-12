<template>
  <view :class="['product-item', className]" @click="handleClick">
    <view class="item-wrapper">
      <image class="item-img" mode="aspectFit" :src="$photoCompress(imgUrl, 300)"/>
    </view>
    <view v-if="speceilStr" class="product-special-str">{{ speceilStr }}</view>
    <view v-if="otherSpeceilStr && !speceilStr" class="product-spceial-empty"></view>
    <view>
      <view class="info">
        <view class="category">{{ category }}</view>
        <view class="subtitle">{{ get(product, 'subTitle') || '' }}</view>
        <view v-if="className === 'plp-product-item' && descriptionSPF" class="subtitle">{{ descriptionSPF }}</view>
        <view class="title">{{ get(product, 'title') || '' }}</view>
      </view>
    </view>
    <view class="bottom">
      <view class="desc-last">
         <rich-text  :nodes="desc"></rich-text>
      </view>
      <view class="price">
        <text>¥ {{ price }}</text>
        <text class="size" v-if="size && isShowSize">{{ size }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/utilityOperationHelper'
import { priceFormat } from '../../utils/utils'
import {
  getCategory, getDescriptionSPF, getSize, getSpecialStr,
} from '../../utils/product'
import { trackerClickProduct, EVENT_TYPE, SCREEN_NAME } from '../../utils/ga'
import ecMixin from './ec.mixin'

export default {
  name: 'productItem',
  mixins: [ecMixin],
  props: {
    product: {
      type: Object,
      default: () => {},
    },
    // plp-product-item
    className: {
      type: String,
      default: '',
    },
    isShowSize: {
      type: Boolean,
      default: true,
    },
    screenName: {
      type: String,
      default: SCREEN_NAME.INDEX,
    },
    // 是否显示 特殊的标签  PLP和PDP商品打标
    isShowSpecialStr: {
      type: Boolean,
      default: false,
    },
    speceilStr: {
      type: String,
      default: '',
    },
    otherSpeceilStr: {
      type: String,
      default: '',
    },
  },
  computed: {
    imgUrl() {
      return get(this.product, 'images[1].url')
    },
    attr() {
      return get(this.product, 'attributes') || []
    },
    category() {
      return getCategory(this.product)
    },
    desc() {
      const res = this.attr.find((item) => item.frontName === '商品描述')
      return get(res, 'values[0].displayName')
    },
    price() {
      // 主打商品的价格  或者spu商品价格
      const mainSku = (get(this.product, 'skus') || []).find((sku) => get(sku, 'featuredType') === 'FEATURED')
      return (priceFormat(get(mainSku, 'salePrice.amount'))) || priceFormat(get(this.product, 'salePrice.amount') || 0)
    },
    size() {
      return getSize(this.product)
    },
    descriptionSPF() {
      return getDescriptionSPF(this.product)
    },
    specailStr() {
      return getSpecialStr(this.product)
    },
  },
  methods: {
    get,
    handleClick() {
      // TODO 活动结束后移除此判断
      if (!this.navigatorToEc()) {
        uni.navigateTo({
          url: `/pages/pdp/index?code=${get(this.product, 'code')}`,
        })
      }

      let gaEvent = {};
      switch (this.screenName) {
        case SCREEN_NAME.PLP:
        case SCREEN_NAME.ACTIVITY_PLP:
        case SCREEN_NAME.SEARCH:
          gaEvent = EVENT_TYPE.PLP_PRODUCT
          break;
        case SCREEN_NAME.INDEX:
          gaEvent = EVENT_TYPE.INDEX_PRODUCT
          break;
        default:
          gaEvent = EVENT_TYPE.INDEX_PRODUCT
      }
      trackerClickProduct(this.product, {
        listName: '产品列表',
        screenName: this.screenName,
        event: gaEvent,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/common.scss';
@import "./index.scss";
</style>
