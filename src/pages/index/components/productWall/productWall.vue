<!-- 产品墙 -->
<template name="productWall">
  <view class="product-wall-components">
    <view class="prd-wall">
      <com-title :title="productWall.name"></com-title>
      <image class="prd-wall-image" :src="productWall.icon" mode="aspectFill"  v-if="productWall.icon" />
      <view class="prd-wall-list" v-if="prodcutList.length > 0">
        <view class="prd-wall-item observer_item" v-for="(item,idx) in prodcutList" :key="idx" :data-index="idx" @click="goPdp(item)" :data-item="item">
          <image class="prd-wall-item-image" :src="item.images[0].url" mode="widthFix" v-if="item.images[0].url" :lazy-load="true"/>
          <view class="prd-wall-item-name" v-if="item.title">{{item.title}}</view>
          <view class="prd-wall-item-price" v-if="item.skus &&　item.skus.length>0 &&　item.skus[0].salePrice.amount">¥ {{item.skus[0].salePrice.amount  | formatMoney}}</view>
        </view>
      </view>
      <customButton  :btnWidth="280" :btnHeight="80" className="transparent" @click="goPlp">探索更多</customButton>
    </view>
  </view>
</template>
<script>
import customButton from '@/components/button/normal.vue';
import { mapActions } from 'vuex';
import { priceFormat } from '@/utils/utils';
import ComTitle from '../comTitle/comTitle';

export default {
  name: 'productWall',
  components: {
    ComTitle,
    customButton,
  },
  props: {
    productWall: {
      type: Object,
      value: {},
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
  watch: {
    productWall: {
      deep: true,
      immediate: true,
      handler(n, o) {
        console.log('productWall', n);
        if (n && n.children && n.children.length > 0 && n.children[0].spuCodes.length > 0) {
          this.queryProductList(n.children[0].spuCodes)
        }
      },
    },
    prodcutList: {
      immediate: true,
      handler(n) {
        if (n.length > 0) {
          this.observe();
        }
      },
    },
  },
  onShow() {
    if (this.prodcutList.length > 0) {
      this.observe();
    }
  },

  data() {
    return {
      prodcutList: [],
      obs: null,
    };
  },
  onLoad(options) {
    console.log('options ==>', options);
  },
  methods: {
    // ...mapActions('search', ['searchProduct']),
    ...mapActions('product', ['getProductList']),
    queryProductList(spuCodes) {
      console.log('getProductList ===> spuCodes ==>', spuCodes)
      this.getProductList(spuCodes).then((res) => {
        console.log('searchProduct ===>', res)
        const list = [];
        res.forEach((ele) => {
          console.log('ele', ele);
          if (ele.onShelves) list.push(ele)
        })
        this.prodcutList = [...list];
        console.log('prodcutList', this.prodcutList)
      })
    },
    // 点击去详情
    goPdp(item) {
      this.$emit('youshuReport', 'trigger_sku_component', item)
      if (item.code) {
        this.$emit('click', item.code);
      }
    },
    goPlp() {
      if (this.productWall.url) {
        uni.navigateTo({
          url: `/subPackages/plp/pages/plp/index?name=${this.productWall.name}&code=${this.productWall.url}&img=`,
        })
      }
    },
    observe() {
      setTimeout(() => {
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
            const { item } = dataset;
            console.log('_observer', dataset)
            console.log('item', item)
            const aData = {
              sku: {
                sku_id: item.code, // 若商品无sku_id时，可传spu_id信息
                sku_name: item.title, // 若商品无sku_name时，可传spu_name信息
              },
              spu: {
                spu_id: item.code, // 若商品无spu_id时，可传sku_id信息
                spu_name: item.title, // 若商品无spu_name时，可传sku_name信息
              },
              sale: {
                original_price: item.skus && item.skus.length > 0 ? item.skus[0].salePrice.amount : 0, // 对接智慧零售入口必传
                current_price: item.skus && item.skus.length > 0 ? item.skus[0].salePrice.amount : 0, // 对接智慧零售入口必传
              },
              primary_image_url: item.image && item.image.length > 0 ? item.image[0].url : '',
            }
            this.$sr.track('expose_sku_component', aData)
          })
      }, 200)
    },

  },
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
// 产品墙
.product-wall-components {
  .prd-wall {
    padding-bottom: 100rpx;
    .prd-wall-image {
      width: calc(100vw);
      height: 442rpx;
    }
    .prd-wall-list {
      width: calc(100vw);
      overflow: hidden;
      margin-bottom: 80rpx;
      .prd-wall-item {
        padding: 80rpx 50rpx 12px;
        width: calc(50vw);
        float: left;
        font-size: 28rpx;
        color: #1d1d1d;
        line-height: 40rpx;
        text-align: center;
        .prd-wall-item-image {
          width: 260rpx;
          height: 260rpx;
        }
        .prd-wall-item-name{
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          line-height: 40rpx;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .prd-wall-item-price {
          margin-top: 38rpx;
        }
      }
    }

  }
}
</style>
