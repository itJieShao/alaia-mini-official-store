<template>
  <view class="product-display">
    <view class="title">{{title}}</view>
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
  .title {
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: rpx(14);
    font-weight: 500;
    line-height: rpx(20);
    text-align: center;
    letter-spacing: 2px;
    color: #1d1d1d;
  }
}

</style>
