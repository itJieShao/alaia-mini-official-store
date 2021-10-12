<template>
  <view>
    <view class="screen-tab">
      <view class="screen-tab-item" style="width: 450rpx;">
        <view class="screen-item-left" style="margin-right: 100rpx;" @click="goFilter">
          筛选
        </view>
        <picker @change="bindPickerChange" :value="index" :range="array">
          <view class="screen-item-left">{{filterClickFlag?array[index]:"排序"}}</view>
        </picker>
      </view>
      <view class="screen-tab-item" style="justify-content: flex-end;">
        <view class="check-box-item" @click="changeSelected">
          <view class="filter-check-icon" :class="selected?'filter-icon-act':''"></view>
          <text>仅有货</text>
        </view>
      </view>
    </view>
    <view class="goods">
      <view class="goods-item observer_item" :style="item.hasBorder?'border-bottom:10rpx solid #E3F0EA;':''"
        v-for="(item,index) in goodsList" @click="goPdp(item)" :key="index" :data-skucode="item.skus[0].code"
        :data-title="item.title" :data-spucode="item.code" :data-price="item.minSkuSalePrice"
        :data-image="item.images.length && item.images[0].url ? item.images[0].url : ''">
        <image :src="item.images[0].url" mode="aspectFit"></image>
        <view style="padding: 30rpx 0;">
          <text style="font-size: 28upx;margin-bottom: 16rpx;">{{item.title}}</text>
          <text>￥{{item.minSkuSalePrice | formatMoney}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  priceFormat,
} from '@/utils/utils';
import zCheckbox from '../checkbox';

export default {
  props: {
    goodsList: {
      type: Array,
      default: [],
    },
  },
  components: {
    zCheckbox,
  },
  data() {
    return {
      index: 0,
      array: ['默认', '价格从低到高', '价格从高到低', '新品'],
      filterClickFlag: false,
      selected: false,
    }
  },
  watch: {
    '$store.state.search.clearSelectFlag': function () {
      this.selected = false;
    },
    goodsList: {
      handler() {
        if (this._observer) {
          this._observer.disconnect();
        }
        this._observer = wx.createIntersectionObserver(this, {
          observeAll: true,
        })
        this._observer.relativeToViewport({
          bottom: 0,
        })
          .observe('.observer_item', (res) => {
            const { dataset } = res;
            const aData = {
              sku: {
                sku_id: dataset.skucode, // 若商品无sku_id时，可传spu_id信息
                sku_name: dataset.title, // 若商品无sku_name时，可传spu_name信息
              },
              spu: {
                spu_id: dataset.spucode, // 若商品无spu_id时，可传sku_id信息
                spu_name: dataset.title, // 若商品无spu_name时，可传sku_name信息
              },
              sale: {
                original_price: dataset.price, // 对接智慧零售入口必传
                current_price: dataset.price, // 对接智慧零售入口必传
              },
              primary_image_url: dataset.image,
            }
            this.$sr.track('expose_sku_component', aData)
          })
      },
      immediate: true,
    },
  },
  filters: {
    formatMoney(val) {
      if (val) {
        return priceFormat(val);
      }
      return '0';
    },
  },
  methods: {
    bindPickerChange(e) {
      const index = e.target.value;
      let sort = {};
      switch (Number(index)) {
        case 0:
          sort = {};
          break;
        case 1:
          sort = {
            name: 'MIN_SKU_SALE_PRICE',
            sort: 'ASC',
          };
          break;
        case 2:
          sort = {
            name: 'MIN_SKU_SALE_PRICE',
            sort: 'DESC',
          };
          break;
        case 3:
          sort = {
            name: 'LIST_TIME',
            sort: 'DESC',
          };
          break;
      }
      this.index = index;
      this.filterClickFlag = true;
      this.$emit('updateList', 1, sort);
    },
    goFilter() {
      this.$emit('goFilter');
    },
    changeSelected() {
      this.selected = !this.selected;
      this.$emit('updateList', 2, this.selected);
    },
    goPdp(item) {
      const aData = {
        sku: {
          sku_id: item.skus[0].code || item.code || 'TASAKI', // 若商品无sku_id时，可传spu_id信息
          sku_name: item.title || 'TASAKI', // 若商品无sku_name时，可传spu_name信息
        },
        spu: {
          spu_id: item.code || item.skus[0].code || 'TASAKI', // 若商品无spu_id时，可传sku_id信息
          spu_name: item.title || 'TASAKI', // 若商品无spu_name时，可传sku_name信息
        },
        sale: {
          original_price: item.minSkuSalePrice || 0, // 对接智慧零售入口必传
          current_price: item.minSkuSalePrice || 0, // 对接智慧零售入口必传
        },
        primary_image_url: '',
      }
      if (item.images.length && item.images[0].url) {
        aData.primary_image_url = item.images[0].url;
      }
      this.$sr.track('trigger_sku_component', aData)
      uni.navigateTo({
        url: `/subPackages/pdp/pages/pdp/index?code=${item.code}`,
      });
    },
  },
}
</script>

<style lang="scss" scoped>
  .screen-tab {
    display: flex;
    justify-content: space-between;
    width: 680upx;
    margin: 20upx auto 32upx;

    .screen-tab-item {
      display: flex;
      align-items: center;

      .check-box-item {
        display: flex;
        align-items: center;

        .filter-check-icon {
          width: 30upx;
          height: 30upx;
          background-color: #fff;
          border: 2upx solid #bbb;
          border-radius: 50%;
        }

        .filter-icon-act {
          background-color: #E3F0EA !important;
          border: 2upx solid #1d1d1d !important;
        }

        text {
          margin-left: 20rpx;
          font-size: 28rpx;
          color: #1d1d1d;
        }
      }

      .screen-item-left {
        display: flex;
        align-items: center;
        font-size: 28upx;
        color: #1d1d1d;
      }

      .screen-item-left:after {
        display: block;
        border-left: 3upx solid #000;
        border-top: 3upx solid #000;
        transform: rotate(224deg);
        content: "";
        position: relative;
        width: 15upx;
        height: 15upx;
        margin: 0 0 8upx 20upx;
      }
    }
  }

  .goods {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 40upx;

    .goods-item {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 2upx solid #F4F4F4;
      box-sizing: border-box;
      margin: 0 -2upx -2upx 0;

      image {
        display: block;
        width: 100%;
        height: 375upx;
      }

      text {
        display: block;
        padding: 0 20upx;
        color: #1d1d1d;
        text-align: center;
      }
    }
  }
</style>
