<template>
  <view>
    <productDisplay v-if="guessLikeProduct.length > 0" title="猜你喜欢" :products="guessLikeProduct"></productDisplay>
    <!-- <productDisplay title="最近浏览" :titleLeft="titleLeft" :products="recentProducts"></productDisplay> -->
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
    recent: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      guessLikeProduct: []
    };
  },
  async created () {
    const { fieldName } = this.config;
    const guessLikeCmsContentMap = await this.getGuessLikeCmsContentMapData();
    const codes = guessLikeCmsContentMap[fieldName];
    const list = await this.getProductList(codes);
    const newList = list.length && list.filter((s) => s != null && s != undefined && s != '');
    this.guessLikeProduct = (newList || []).map((item) => ({
      code: item.code,
      productPrice: get(item, 'skus[0].salePrice.amount'),
      productName: item.title,
      productImg: item.images[0].url || placeholderImg,
      onShelves: item.onShelves,
      skuCode: get(item, 'skus[0].code'),
    })).filter((v) => v.onShelves);
  },
  methods: {
    ...mapActions('product', ['getProductList']),
    ...mapActions('cms', ['getGuessLikeCmsContentMapData'])
  },
};
</script>

<style lang="scss" scoped>
</style>
