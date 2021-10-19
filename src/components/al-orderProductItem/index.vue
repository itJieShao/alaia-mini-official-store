<template>
  <view :class="['product-box', className]" :key="product.code" @click="handleClick">
    <view class="item-box">
      <view class="product-img">
        <image :lazy-load="true" :src="imgUrlReplace(imgUrl, 375, 375)"/>
      </view>
      <view class="product-info">
        <view class="ch-title" style="line-height: 1.5;">{{ product.title || product.name || '' }}</view>
        <text class="num-box">颜色: {{ product.style || '-' }}</text>
        <text class="num-box">尺码: {{ product.size || '-' }}</text>
        <text class="num-box">数量: {{ product.quantity || 1 }}</text>
      </view>
      <text class="price">￥{{ price }}</text>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/utilityOperationHelper';
import { priceFormat, imgUrlReplace } from '../../utils/utils'
import { getCategory } from '../../utils/product'

export default {
  name: 'OrderProductItem',
  props: {
    product: {
      type: Object,
      default: () => {},
    },
    // order-product-box
    className: {
      type: String,
      default: '',
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    hasMaterial: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    category() {
      try {
        return get(JSON.parse(get(this.product, 'extInfos') || '{}'), 'category')
      } catch (error) {
        console.log('解析失败', error)
        return ''
      }
    },
    price() {
      return this.priceFormat(get(this.product, 'salePrice.amount') || get(this.product, 'amount.amount'))
    },
    material() {
      const attributes = get(this, 'product.attributes', [])
      const materialItem = attributes.find((item) => item.name === '具体材质&尺寸')
      const frontName = get(materialItem || {}, 'values[0].frontName')
      return frontName && frontName.split('\n')[0]
    },
    imgUrl() {
      return get(this.product, 'images[0].url') || get(this.product, 'image')
    },
  },
  methods: {
    get,
    imgUrlReplace,
    priceFormat,
    getCategory,
    handleClick() {
      if (!this.isLink) { return }
      this.$sr.track('trigger_sku_component',
        {
          sku: {
            sku_id: this.product.skuCode || this.product.code || this.product.spuCode || 'ALAIA', // 若商品无sku_id时，可传spu_id信息
            sku_name: this.product.title || this.product.name || 'ALAIA', // 若商品无sku_name时，可传spu_name信息
          },
          spu: {
            spu_id: this.product.spuCode || this.product.code || this.product.skuCode || 'ALAIA', // 若商品无spu_id时，可传sku_id信息
            spu_name: this.product.title || this.product.name || 'ALAIA', // 若商品无spu_name时，可传sku_name信息
          },
          sale: {
            original_price: get(this.product, 'amount.amount') || get(this.product, 'salePrice.amount') || 0, // 对接智慧零售入口必传
            current_price: get(this.product, 'amount.amount') || get(this.product, 'salePrice.amount') || 0, // 对接智慧零售入口必传
          },
          primary_image_url: get(this.product, 'image'),
        })
      // 这里要修改一下
      uni.navigateTo({
        url: `/subPackages/pdp/pages/pdp/index?code=${get(this.product, 'code') || get(this.product, 'spuCode')}&skuCode=${ get(this.product, 'skuCode') || '' }`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  @import './index';
</style>
