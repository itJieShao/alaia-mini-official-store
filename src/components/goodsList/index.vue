<template>
  <view class="goods-wrap">
    <view class="goods">
      <view class="goods-item observer_item" v-for="(item,index) in goodsList" @click="goPdp(item)" :key="index" :data-skucode="item.skus[0].code" :data-title="item.title" :data-spucode="item.code" :data-price="item.minSkuSalePrice" :data-image="item.images.length && item.images[0].url ? item.images[0].url : ''">
        <view class="collection">
          <text class="icon-font icon-shoucangchenggong1" v-if="item.favorite.id"></text>
          <text class="icon-font icon-shoucang" v-else></text>
        </view>
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
    <view class="screen-tab-wrap" v-if="!noFilter&&isStatic">
      <view class="screen-tab">
        <view class="item" @click="goFilter">筛选</view>
        <view class="item" @click="openSort(true)">排序</view>
      </view>
    </view>

    <view class="sort-wrap" v-show="showSort" catchtouchmove="true">
      <view class="sort-mark" @click="openSort(false)"></view>
      <view class="sort-content">
        <view class="title">商品排序</view>
        <view class="item" v-for="(item,index) in arraySort" :key="index" @click="sortChange(item)">
          <view class="item-text">{{item.label}}<text class="icon-font icon-gouxuanchenggong" v-if="item.active"></text></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { priceFormat } from '@/utils/utils';

export default {
  props: {
    goodsList: {
      type: Array,
      default: () => [],
    },
    noFilter: {
      type: Boolean,
      default: false,
    },
    isStatic: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      arraySort: [
        {
          label: '默认',
          active: true,
          sort: {},
        },
        {
          label: '价格从低到高',
          sort: {
            name: 'MIN_SKU_SALE_PRICE',
            sort: 'ASC',
          },
        },
        {
          label: '价格从高到低',
          sort: {
            name: 'MIN_SKU_SALE_PRICE',
            sort: 'DESC',
          },
        },
        {
          label: '新品',
          sort: {
            name: 'LIST_TIME',
            sort: 'DESC',
          },
        },
        {
          label: '畅销',
          sort: {
            name: 'SALES',
            sort: 'DESC',
          },
        },
      ],
      showSort: false,
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
            // this.$sr.track('expose_sku_component', aData)
          })
      },
      immediate: true,
    },
  },
  filters: {
    formatMoney: (val) => (val ? priceFormat(val) : 0),
  },
  methods: {
    openSort (e) {
      this.showSort = e
    },
    sortChange (item) {
      this.arraySort.forEach((element) => {
        element.active = false
      });
      item.active = true
      this.$emit('updateList', 1, item.sort);
      this.openSort(false)
    },
    goFilter () {
      this.$emit('goFilter');
    },
    goPdp (item) {
      const aData = {
        sku: {
          sku_id: item.skus[0].code || item.code || 'ALAIA', // 若商品无sku_id时，可传spu_id信息
          sku_name: item.title || 'ALAIA', // 若商品无sku_name时，可传spu_name信息
        },
        spu: {
          spu_id: item.code || item.skus[0].code || 'ALAIA', // 若商品无spu_id时，可传sku_id信息
          spu_name: item.title || 'ALAIA', // 若商品无spu_name时，可传sku_name信息
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
      // this.$sr.track('trigger_sku_component', aData)
      uni.navigateTo({
        url: `/subPackages/pdp/pages/pdp/index?code=${item.code}`,
      });
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.goods-wrap {
  font-size: 0;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding-bottom: var(--safe-area-inset-bottom);
}
.screen-tab-wrap {
  position: fixed;
  z-index: 99;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: var(--safe-area-inset-bottom);
  background-color: #fff;
  .screen-tab {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding: rpx(5) rpx(50);
    .item {
      font-family: PingFangSC, PingFangSC-Medium;
      font-size: rpx(14);
      font-weight: 500;
      line-height: rpx(20);
      padding: rpx(10) rpx(50);
      letter-spacing: 1px;
      color: #fff;
      background-color: #1d1d1d;
    }
  }
}
.goods {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: rpx(40);
  .goods-item {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    width: 50%;
    background-color: #fff;
    &:nth-child(odd) {
      border-right: rpx(5) solid #fff;
    }
    .collection {
      position: absolute;
      z-index: 1;
      top: rpx(10);
      right: rpx(10);
      .icon-font {
        font-size: rpx(17);
      }
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
      // border: rpx(1) solid #1d1d1d;
    }
    .title {
      margin-top: rpx(12);
    }
    .price {
      margin-top: rpx(4);
    }
  }
}
.sort-wrap {
  position: fixed;
  z-index: 1002;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  .sort-mark {
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
  }
  .sort-content {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 rpx(16);
    padding-bottom: var(--safe-area-inset-bottom);
    background-color: #fff;
    .title {
      font-family: PingFangSC, PingFangSC-Medium;
      font-size: rpx(18);
      font-weight: 500;
      line-height: rpx(25);
      margin-bottom: rpx(21);
      padding-top: rpx(20);
      text-align: center;
      letter-spacing: 1px;
      color: #1d1d1d;
    }
    .item {
      padding: rpx(17) 0;
      text-align: center;
      border-bottom: 1px solid #f4f4f4;
      &:last-child {
        border-bottom: none;
      }
      .item-text {
        font-family: PingFangSC, PingFangSC-Regular;
        font-size: rpx(14);
        font-weight: 400;
        line-height: rpx(20);
        position: relative;
        display: inline-block;
        letter-spacing: 2px;
        color: #1d1d1d;
      }
      .icon-font {
        font-size: rpx(12);
        position: absolute;
        top: 0;
        right: rpx(-30);
        color: #1d1d1d;
      }
    }
  }
}

</style>
