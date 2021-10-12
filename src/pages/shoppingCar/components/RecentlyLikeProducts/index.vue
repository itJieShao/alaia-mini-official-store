<template>
  <view>
    <productDisplay
      v-if="guessLikeProduct.length"
      title="猜你喜欢"
      :products="guessLikeProduct">
    </productDisplay>
    <productDisplay
      v-if="recentProducts.length"
      title="最近浏览"
      :products="recentProducts"
    ></productDisplay>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
import productDisplay from '@/components/product-display';
import { queryGuessLikeGoods } from '@/service/apis'
import { get } from '@/utils/utilityOperationHelper'

const placeholderImg = 'https://res-tasaki.baozun.com/static/images/empty.png'

export default {
  name: 'RecentlyLikeProducts',
  components: {
    productDisplay,
  },
  props: {},
  data() {
    return {
      guessLikeProduct: [],
      recentProducts: [],
    };
  },
  created() {
    this.getGuessLike()
    this.getRecentProducts()
  },
  methods: {
    ...mapActions('search', ['searchProduct']),
    ...mapActions('product', ['getProductList']),
    async getGuessLike() {
      try {
        const res = await queryGuessLikeGoods({
          templateCode: 'P001',
          contentCode: 'guess',
        })
        const cmsContent = JSON.parse(get(res, 'data.shop.cmsContent', null)) || {}
        const skuCodes = get(cmsContent, 'content.zh_CN.A1.modelContents[0].groupContents.A001', [])
          .map((v) => ({ key: 'spuCode', value: v.fieldContents.SKUCODE }))
        const productRes = await this.searchProduct({ filters: { attributes: skuCodes } })
        this.guessLikeProduct = (productRes.list || []).map((item) => {
          const images = get(item, 'images', []).filter((v) => v.type !== 'DETALMATERIALIMAGE')
          return {
            productName: item.title,
            productImg: images.length ? images[0].url : placeholderImg,
            productPrice: get(item, 'skus[0].salePrice.amount'),
            code: item.code,
            onShelves: item.onShelves,
            skuCode: get(item, 'skus[0].code'),
          }
        }).filter((v) => v.onShelves)
      } catch (error) {
        console.error(error)
      }
    },
    async getRecentProducts() {
      const localData = uni.getStorageSync('recentBrowseGoods') || [];
      const codes = localData.map((v) => v.code)
      this.getProductList(codes).then((list) => {
        console.log(list, '<<<<list')
        const newList = list.length && list.filter((s) => s != null && s != undefined && s != '');
        this.recentProducts = (newList || []).map((item) => ({
          code: item.code,
          productPrice: get(item, 'skus[0].salePrice.amount'),
          productName: item.title,
          productImg: item.images[0].url || placeholderImg,
          onShelves: item.onShelves,
          skuCode: get(item, 'skus[0].code'),
        })).filter((v) => v.onShelves)
      })
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
