<template>
  <view>
    <productDisplay v-if="showRecent && recentProducts.length > 0" title="最近浏览" :products="recentProducts"></productDisplay>
    <productDisplay v-if="showGuessLike && guessLikeProduct.length > 0" title="猜你喜欢" :products="guessLikeProduct"></productDisplay>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import productDisplay from '@/components/product-display';
import { get } from '@/utils/utilityOperationHelper'


export default {
  name: 'RecentlyLikeProducts',
  components: {
    productDisplay,
  },
  props: {
    config: {
      type: Object,
      default: {}
    },
    showRecent: {
      type: Boolean,
      default: true,
    },
    showGuessLike: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      guessLikeProduct: [],
      recentProducts: []
    };
  },
  async created () {
    if (this.showGuessLike) {
      this.getGuessLike();
    }
    if (this.showRecent) {
      this.getRecentProducts();
    }
  },
  methods: {
    ...mapActions('product', ['getProductList']),
    ...mapActions('cms', ['getGuessLikeCmsContentMapData']),
    async handleProductList (codes, paramsName) {
      const list = await this.getProductList(codes);
      const newList = list.length && list.filter((s) => s != null && s != undefined && s != '');
      this[paramsName] = (newList || []).map((item) => ({
        code: item.code,
        productPrice: get(item, 'skus[0].salePrice.amount'),
        productName: item.title,
        productImg: item.images[0].url || placeholderImg,
        onShelves: item.onShelves,
        skuCode: get(item, 'skus[0].code'),
      })).filter((v) => v.onShelves);
    },
    async getGuessLike() {
      const { fieldName } = this.config;
      const guessLikeCmsContentMap = await this.getGuessLikeCmsContentMapData();
      const codes = guessLikeCmsContentMap[fieldName];
      this.handleProductList(codes, 'guessLikeProduct');
    },
    async getRecentProducts() {
      const localData = uni.getStorageSync('recentBrowseGoods') || [];
      const codes = localData.map((v) => v.code)
      this.handleProductList(codes, 'recentProducts');
      console.log('recentProducts---->', this.recentProducts);
    }
    
  },
};
</script>

<style lang="scss" scoped>
</style>
