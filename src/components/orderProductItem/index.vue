<template>
  <view :class="['product-box', className]" :key="product.code" @click="handleClick">
    <view class="item-box">
      <view class="product-img">
        <image :lazy-load="true" :src="imgUrlReplace(imgUrl, 375, 375)"/>
      </view>
      <view class="product-info">
        <view class="ch-title" style="line-height: 1.5;">{{ product.title || product.name || '' }}</view>
        <!-- <view class="title">{{ getCategory(product) || category }}</view> -->
        <text class="sub-title" v-if="hasMaterial">{{ material || get(product, 'material') }}</text>
        <view class="num-box size-box" v-if="product.style">
          <text class="price">款式: {{ product.style || ''}}</text>
        </view>
        <view class="num-box size-box" v-if="product.size && product.size !== '00'">
          <text class="price">尺寸: {{ product.size || ''}}</text>
        </view>
        <view class="num-box number-box">
          <text class="number">数量: {{ product.quantity || 1 }}</text>
        </view>
        <view class="num-box">
          <text class="price">￥{{ price }}</text>
        </view>
      </view>
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
      uni.navigateTo({
        url: `/subPackages/pdp/pages/pdp/index?code=${get(this.product, 'code') || get(this.product, 'spuCode')}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.product-box {
  width: 100%;
  padding-bottom: 30rpx;
  .item-box {
    // margin-top: 15rpx;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    // padding: 33rpx 5rpx;
    padding-bottom: 40rpx;
    border-bottom: 2rpx solid #F4F4F4;
    .product-img {
      // width: 40%;
      image {
        width: 280rpx;
        height: 280rpx;
        display: block;
      }
    }
    .product-info {
      // width: 60%;
      margin-left: 66rpx;
      flex: 1;
      .title {
        font-size: 28rpx;
        font-weight: 300;
        margin-top: 36rpx;
        color: #252525;
        word-break: break-word;
      }
      .sub-title {
        font-size: 28rpx;
        color: #252525;
        font-weight: 300;
        // line-height: 50rpx;
        word-break: break-word;
      }
      .ch-title {
        font-size: 28rpx;
        font-weight: 300;
        margin-bottom: 26rpx;
      }
      .num-box {
        margin-top: 32rpx;
        &.number-box {
         margin-bottom: 50rpx;
        }
        &.size-box {
          margin-top: 40rpx;
        }
        .number {
          font-size: 28rpx;
          display: inline-block;
          margin-right: 30rpx;
          color:#1D1D1D;
        }
        .price {
          font-size: 28rpx;
          display: inline-block;
          margin-right: 30rpx;
          color: #252525;
        }
      }
    }
  }
  &.order-product-box {
    padding-bottom: 0;
    .item-box {
      border-bottom: none;
      .product-img  {
        width: 180rpx;
        image {
          width: 180rpx;
          height: 180rpx;
        }
      }
      .product-info {
        margin-left: 20rpx;
        width: calc(100% - 200rpx);
        // .sub-title {
        //   line-height: 1;
        // }
        .title {
          margin-top: 0rpx;
          font-size: 26rpx;
          line-height: 38rpx;
        }
        .ch-title {
          line-height: 50rpx;
        }
        .num-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .price {
            padding-right: 40rpx;
          }
        }
      }
    }
  }
}
</style>
