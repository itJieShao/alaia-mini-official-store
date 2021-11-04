<template>
  <view>
    <view class="search-res">抱歉，没有找到任何关于“{{keyword.name}}”的结果 </view>
    <search-input @getProduct="getProduct" placeholder="重新搜索" />
    <view class="no-list">
      <recently-like-products :showRecent="false" :config="GUESS_LIKE_SEARCH_CONFIG" />
    </view>
  </view>
</template>

<script>
import searchInput from '@/components/searchInput';
import { GUESS_LIKE_SEARCH_CONFIG } from '@/constants/cms';
import RecentlyLikeProducts from '@/components/al-recentlyLikeProducts'

export default {
  components: {
    searchInput,
    RecentlyLikeProducts,
  },
  data () {
    return {
      GUESS_LIKE_SEARCH_CONFIG,
    }
  },
  props: {
    keyword: {
      type: Object,
      default: {},
    },
  },
  methods: {
    getProduct (params) {
      this.$emit('getProduct', params, 1);
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.no-list {
  margin-top: rpx(54);
  padding-bottom: calc(100rpx + var(--safe-area-inset-bottom));
  color: #1d1d1d;
}
.search-res {
  font-family: PingFangSC, PingFangSC-Medium;
  font-size: rpx(14);
  font-weight: 500;
  line-height: rpx(14);
  margin-top: rpx(27);
  padding: 0 rpx(16);
  text-align: left;
  letter-spacing: 1px;
  color: #272727;
}

</style>
