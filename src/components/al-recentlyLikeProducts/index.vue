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
      const { contentCode } = this.config;
      const resData = await this.getCmsContentMapData();
      const cmsContent = JSON.parse(resData[contentCode]) || {};
      let skuList = [];
      get(cmsContent, `zh_CN.sku_list.modelContents`, []).forEach((v) => {
        skuList = v.groupContents[`product_sku_list`].map(s => s.fieldContents);   
      })
      console.log(skuList);
  },
  methods: {
      ...mapActions('cms', ['getCmsContentMapData'])
  },
};
</script>

<style lang="scss" scoped>
</style>
