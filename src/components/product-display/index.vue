<template>
  <section class="product-display">
    <div class="section-titile" v-if="title">
      <div class="logo-wrap">
        <image
          src="http://res-tasaki.baozun.com/static/images/tasaki.png"
        ></image>
      </div>
      <span>{{ title }}</span>
    </div>
    <productSwiper @clickItem="handleClick" :products="products" />
  </section>
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
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    handleClick(item) {
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
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
.section-titile {
  margin-bottom: 100rpx;
  text-align: center;
  .logo-wrap {
    width: 144rpx;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 20rpx;
    border-bottom: 8rpx solid #e3f0ea;
    image {
      width: 106rpx;
      height: 16rpx;
    }
  }
  span {
    font-size: 32rpx;
    color: #0e0e0e;
  }
}
</style>
