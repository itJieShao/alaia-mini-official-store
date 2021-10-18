<template>
  <view class="product-display">
    <view class="label" v-if="titleLeft">{{title}}</view>
    <view class="line-title" v-else>
      <view class="line"></view>
      <text class="icon-font icon-icon-tuxingxingzhuang"></text>
      <view class="title">{{title}}</view>
    </view>
    <productSwiper @clickItem="handleClick" :products="products" />
  </view>
</template>

<script>
import productSwiper from '../product-swiper';

export default {
  name: 'product-display',
  components: {
    productSwiper,
  },
  mixins: [],
  props: {
    title: String,
    products: {
      type: Array,
      default: () => [],
    },
    titleLeft: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {};
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    handleClick (item) {
      this.$sr.track('trigger_sku_component',
        {
          sku: {
            sku_id: item.skuCode || item.code || 'TASAKI', // 若商品无sku_id时，可传spu_id信息
            sku_name: item.productName || 'TASAKI', // 若商品无sku_name时，可传spu_name信息
          },
          spu: {
            spu_id: item.code || item.skuCode || 'TASAKI', // 若商品无spu_id时，可传sku_id信息
            spu_name: item.productName || 'TASAKI', // 若商品无spu_name时，可传sku_name信息
          },
          sale: {
            original_price: item.productPrice || 0, // 对接智慧零售入口必传
            current_price: item.productPrice || 0, // 对接智慧零售入口必传
          },
          primary_image_url: item.productImg,
        })
      uni.navigateTo({
        url: `/subPackages/pdp/pages/pdp/index?code=${item.code}`,
      })
    },
  },
  beforeCreate () { },
};
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.product-display {
  margin-bottom: rpx(7);
  .label {
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: rpx(14);
    font-weight: 500;
    line-height: rpx(20);
    margin-bottom: rpx(30);
    padding-left: rpx(16);
    text-align: left;
    letter-spacing: 1px;
    color: #1d1d1d;
  }
  .line-title {
    position: relative;
    margin-bottom: rpx(30);
    .line {
      margin-bottom: rpx(31);
      border-top: 1px solid #1d1d1d;
    }
    .icon-font {
      font-size: rpx(14);
      line-height: 1;
      position: absolute;
      top: rpx(-3);
      left: 50%;
      display: inline-block;
      width: rpx(31);
      height: rpx(4);
      padding: 0 rpx(7);
      transform: translate(-50%, 0);
      color: #1d1d1d;
      background-color: #fff;
    }
    .title {
      font-family: PingFangSC, PingFangSC-Semibold;
      font-size: rpx(16);
      font-weight: 600;
      line-height: rpx(22);
      text-align: center;
      letter-spacing: 1px;
      color: #1d1d1d;
    }
  }
}

</style>
