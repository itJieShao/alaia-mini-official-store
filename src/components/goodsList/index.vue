<template>
  <view>
    <view class="screen-tab" v-if="!noFilter">
      <view class="screen-tab-item" style="width: 450rpx;">
        <view class="screen-item-left" style="margin-right: 100rpx;" @click="goFilter">
          筛选
        </view>
        <picker @change="bindPickerChange" :value="index" :range="array">
          <view class="screen-item-left">{{filterClickFlag?array[index]:"排序"}}</view>
        </picker>
      </view>
    </view>
    <view class="goods">
      <view class="goods-item observer_item" v-for="(item,index) in goodsList" @click="goPdp(item)" :key="index" :data-skucode="item.skus[0].code" :data-title="item.title" :data-spucode="item.code" :data-price="item.minSkuSalePrice" :data-image="item.images.length && item.images[0].url ? item.images[0].url : ''">
        <view class="cover">
          <image :src="item.images[0].url" mode="aspectFit"></image>
        </view>
        <view class="info">
          <view class="txt tag">标签</view>
          <view class="txt title">{{item.title}}</view>
          <view class="txt price">￥{{item.minSkuSalePrice | formatMoney}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { priceFormat } from '@/utils/utils';
import zCheckbox from '../checkbox';

export default {
  props: {
    goodsList: {
      type: Array,
      default: [],
    },
    noFilter: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    zCheckbox,
  },
  data () {
    return {
      index: 0,
      array: ['默认', '价格从低到高', '价格从高到低', '新品'],
      filterClickFlag: false,
    }
  },
  watch: {
    goodsList: {
      handler () {
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
    formatMoney (val) {
      if (val) {
        return priceFormat(val);
      }
      return '0';
    },
  },
  methods: {
    bindPickerChange (e) {
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
    goFilter () {
      this.$emit('goFilter');
    },
    goPdp (item) {
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
@import '@/styles/utilities.scss';
.screen-tab {
  display: flex;
  justify-content: space-between;
  width: 680upx;
  margin: 20upx auto 32upx;
  .screen-tab-item {
    display: flex;
    align-items: center;
    .screen-item-left {
      font-size: 28upx;
      display: flex;
      align-items: center;
      color: #1d1d1d;
    }
    .screen-item-left:after {
      position: relative;
      display: block;
      width: 15upx;
      height: 15upx;
      margin: 0 0 8upx 20upx;
      content: '';
      transform: rotate(224deg);
      border-top: 3upx solid #000;
      border-left: 3upx solid #000;
    }
  }
}
.goods {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: rpx(40);
  .goods-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    width: 50%;
    background-color: #fff;
    &:nth-child(odd) {
      border-right: rpx(5) solid #fff;
    }
    .cover {
      width: 100%;
      height: rpx(255);
      background-color: #f7f7f7;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      padding: 0 rpx(10);
      padding-bottom: rpx(20);
      background-color: #fff;
    }
    .txt {
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: rpx(12);
      font-weight: 400;
      line-height: rpx(14);
      text-align: center;
      color: #1d1d1d;
    }
    .tag {
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      margin-top: rpx(14);
      padding: rpx(4);
      border: rpx(1) solid #1d1d1d;
    }
    .title {
      margin-top: rpx(12);
    }
    .price {
      margin-top: rpx(4);
    }
  }
}

</style>
