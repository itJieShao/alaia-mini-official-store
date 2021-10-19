<template>
    <view class="sp-item" :class="{disabled: !isInventory}">
      <!-- 选中商品 -->
      <view class="c-box">
        <z-checkbox
          v-if="isInventory"
          @checkEvent="checkedEventer"
          value="selectedItem"
          :checked="productData.selected"
        ></z-checkbox>
        <z-checkbox v-else :disabled="!isInventory"></z-checkbox>
      </view>
      <!-- 商品图片 -->
      <view class="image-box" @tap="toPDP" v-if="skuData">
        <image
          class="image"
          mode="aspectFit"
          :lazy-load="true"
          :src="imgUrlReplace(skuData.product.images[0].url || skuData.product.images[1].url, 375, 375 )">
        </image>
        <view class="no-stock-txt" v-if="!onShelves || inventory <= 0">该商品暂时缺货</view>
      </view>
      <!-- 商品信息 -->
      <view class="info-box">
        <text class="p-name" @tap="toPDP">{{ skuData.product.title }}</text>
        <view class="select-attr-field">
          <text class="label">颜色:</text>
          <view class="content" :class="{ 'no-bg': !isInventory }">
            <picker @change="bindStylePickerChange" :value="styleIndex" :range="styleOptions" range-key="frontName" v-if="isInventory">
                <text class="value">{{ currentStyle }}</text>
                <view class="arrow-icon"></view>
            </picker>
            <text class="value" v-else>{{ currentStyle }}</text>
          </view>
        </view>
        <view class="select-attr-field">
          <text class="label">尺寸:</text>
          <view class="content" :class="{ 'no-bg': !isInventory }">
            <picker @change="bindStylePickerChange" :value="sizeIndex" :range="sizeOptions" range-key="frontName" v-if="isInventory">
                <text class="value">{{ currentSize }}</text>
                <view class="arrow-icon"></view>
            </picker>
            <text class="value" v-else>{{ currentSize }}</text>
          </view>
        </view>
        
        <view class="price-box">
          <view class="amount"><text class="label">数量:</text> 1</view>
          <view class="price">{{ skuData.salePrice.amount | currency }}</view>
        </view>
      </view>
      <!-- 删除按钮 -->
      <view class="delete-btn" v-if="!productData.bonusProduct" @tap="deleteEventer">
        <text class="icon-font icon-guanbi"></text>
      </view>
  </view>
</template>

<script>
import utils, { imgUrlReplace } from '@/utils/utils';
import { getProductDetailsAction } from '@/service/apis/pdp';
import zCheckbox from '../../../../components/al-checkbox';
import { get } from '../../../../utils/utilityOperationHelper';

import { getCategory, getDescription, getSizeBySkuInfo } from '../../../../utils/product'

export default {
  props: {
    productData: {
      type: Object,
      default: () => {},
    },
  },
  components: { zCheckbox },
  data() {
    return {
      inventoryMsg: false,
    };
  },
  computed: {
    skuData() {
      const productData = {
        ...this.productData.sku,
        lineId: this.productData.lineId,
      }
      return productData;
    },
    desc() {
      return getDescription(get(this, 'skuData.product'))
    },
    category() {
      return getCategory(get(this, 'skuData.product'))
    },
    // 材质
    material() {
      const attributes = get(this, 'skuData.product.attributes', [])
      const materialItem = attributes.find((item) => item.name === '具体材质&尺寸')
      const frontName = get(materialItem || {}, 'values[0].frontName')

      return frontName && frontName.split('\n')[0]
    },
    currentSize() {
      return getSizeBySkuInfo(this.skuData)
    },
    currentStyle() {
      const styleItem = get(this.skuData, 'showAttrList', []).find((v) => v.code === 'customSizeDesc')
      return styleItem && styleItem.attrValueList[0] && styleItem.attrValueList[0].frontName
    },
    styleIndex() {
      return this.styleOptions.findIndex((item) => item.frontName === this.currentStyle)
    },
    sizeIndex() {
      return this.sizeOptions.findIndex((item) => item.frontName === this.currentSize)
    },
    numIndex() {
      return this.numOptions.findIndex((item) => item === this.productData.quantity)
    },
    // 尺寸可选列表
    sizeOptions() {
      const skus = get(this, 'skuData.product.replaceableSkus', []).filter((v) => v.inventory > 0)
      const _list = skus.map((item) => {
        const sizeItem = get(item, 'options', []).find((v) => v.originCode === 'customSize')
        return {
          lineId: this.skuData.lineId,
          skuCode: item.code,
          frontName: get(sizeItem, 'value.frontName'),
          code: get(sizeItem, 'value.code'),
        }
      })
      _list.sort((a, b) => a.frontName - b.frontName)
      return _list
    },
    // 样式可选列表
    styleOptions() {
      const skus = get(this, 'skuData.product.replaceableSkus', []).filter((v) => v.inventory > 0)
      const _list = skus.map((item) => {
        const styleItem = get(item, 'showAttrList', []).find((v) => v.originCode === 'customSizeDesc')
        return {
          skuCode: item.code,
          frontName: get(styleItem, 'attrValueList[0].frontName'),
          code: get(styleItem, 'attrValueList[0].code.'),
        }
      })
      return _list
    },
    // 数量可选列表
    numOptions() {
      if (this.inventory >= 2) {
        return [1, 2]
      }
      return this.inventory > 0 ? [1] : []
    },
    inventory() {
      return get(this.skuData, 'inventory')
    },
    isInventory() {
      return this.onShelves && this.inventory > 0
    },
    initInventoryTips() {
      return get(this.productData, 'quantity') > this.inventory
    },
    onShelves() {
      return get(this.skuData, 'product.onShelves')
    },
    trackProductData() {
      return {
        skuCode: get(this.skuData, 'code'),
        skuName: get(this.skuData, 'product.title'),
        spuCode: get(this.skuData, 'product.code'),
        amount: get(this.skuData, 'salePrice.amount'),
      }
    },
  },
  watch: {
    'productData.id': {
      handler() {
        this.inventoryMsg = false
      },
      immediate: true,
    },
  },
  methods: {
    imgUrlReplace,
    deleteEventer() {
      this.$emit('deleteEventer', [this.skuData.lineId])
    },
    handlePickerClick() {
      getProductDetailsAction({ codes: [this.skuData.product.code] }).then((res) => {
        const product = get(res, 'data.shop.productByCode[0]')
        this.sizeOptions = product.options[0].values
      })
    },
    toPDP() {
      this.$sr.track('trigger_sku_component',
        {
          sku: {
            sku_id: this.trackProductData.skuCode || this.trackProductData.spuCode || 'ALAIA', // 若商品无sku_id时，可传spu_id信息
            sku_name: this.trackProductData.skuName || 'ALAIA', // 若商品无sku_name时，可传spu_name信息
          },
          spu: {
            spu_id: this.trackProductData.spuCode || 'ALAIA', // 若商品无spu_id时，可传sku_id信息
            spu_name: this.trackProductData.skuName || 'ALAIA', // 若商品无spu_name时，可传sku_name信息
          },
          sale: {
            original_price: this.trackProductData.amount || 0, // 对接智慧零售入口必传
            current_price: this.trackProductData.amount || 0, // 对接智慧零售入口必传
          },
          primary_image_url: get(this.skuData, 'product.images[0].url'),
      })
      uni.navigateTo({
        url: `/subPackages/pdp/pages/pdp/index?code=${this.skuData.product.code}&skuCode=${ get(this.skuData, 'code') || '' }`,
      });
    },
    bindPickerChange(e) {
      console.log('picker发送选择改变，携带值为', e.target.value)
      if (this.sizeIndex !== Number(e.target.value)) {
        this.$emit('changeSize', {
          addSku: this.sizeOptions[e.target.value].skuCode,
          delSku: this.skuData.lineId,
          quantity: this.productData.quantity,
          trackProductData: this.trackProductData,
        })
      }
    },
    bindStylePickerChange(e) {
      if (this.styleIndex !== Number(e.target.value)) {
        console.log('styles', {
          addSku: this.sizeOptions[e.target.value].skuCode,
          delSku: this.skuData.lineId,
          quantity: this.productData.quantity,
          trackProductData: this.trackProductData,
        })
        this.$emit('changeSize', {
          addSku: this.sizeOptions[e.target.value].skuCode,
          delSku: this.skuData.lineId,
          quantity: this.productData.quantity,
          trackProductData: this.trackProductData,
        })
      }
    },
    bindNumPickerChange(e) {
      if ((Number(e.target.value) + 1) !== this.productData.quantity) {
        this.$emit('updateNum', [
          {
            quantity: Number(e.target.value) + 1,
            lineId: this.skuData.lineId,
            trackProductData: this.trackProductData,
          },
        ])
      }
    },
    updateNum(num) {
      const { quantity } = this.productData;
      const inventory = quantity + num
      // 实际库存 < 增加的库存 , 则显示 error 信息
      this.inventoryMsg = this.inventory < inventory;
      // 如果是增加库存，并且有error信息
      if (this.inventoryMsg && num > 0) {
        return
      }
      if (inventory <= 0) {
        uni.showToast({
          title: '此商品最少购入一件',
          icon: 'none',
        });
        return
      }
      if (inventory > 5) {
        uni.showToast({
          title: '最多购买5件',
          icon: 'none',
        });
        return
      }
      this.$emit('updateNum', [
        {
          quantity: this.inventoryMsg && num < 0 ? this.inventory : inventory,
          lineId: this.skuData.lineId,
          trackProductData: this.trackProductData,
        },
      ])
    },
    checkedEventer({ checked }) {
      console.log('checked', checked)
      this.cartStatusUpdate(checked);
    },
    cartStatusUpdate(checked) {
      this.$emit('cartStatusUpdate', { selected: checked, lineIds: [this.skuData.lineId] })
    },
  },

  filters: {
    currency(value) {
      if (!value && value !== 0) return '';
      return utils.currency(value);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "./productItem";
</style>
