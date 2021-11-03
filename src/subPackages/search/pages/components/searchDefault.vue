<template>
  <view>
    <search-input @getProduct="getProduct" />
    <view class="search-recommend">
      <text class="title">热词搜索</text>
      <view class="hot-list">
        <view @click="searchClick(item)" :class="['item',index==0?'hot':'']" v-for="(item,index) in hotWords" :key="index">
          {{ item.name }}
        </view>
      </view>
    </view>
    <view class="guess-like">
      <recently-like-products :showRecent="false" :config="GUESS_LIKE_SEARCH_CONFIG" />
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import searchInput from '@/components/searchInput';
import { SEARCH_HOT_WORD_CONFIG, GUESS_LIKE_SEARCH_CONFIG } from '@/constants/cms';
import { get } from '@/utils/utilityOperationHelper';
import RecentlyLikeProducts from '@/components/al-recentlyLikeProducts';

export default {
  components: {
    searchInput,
    RecentlyLikeProducts,
  },
  data () {
    return {
      GUESS_LIKE_SEARCH_CONFIG,
      hotWords: []
    }
  },

  mounted() {
    this.getHotWords();
  },
  methods: {
    ...mapActions('cms', ['getCmsContentMapData']),
    getProduct (params) {
      this.$emit('getProduct', params);
    },
    searchClick (keyword) {
      this.$emit('getProduct', keyword);
    },
    async getHotWords() {
        const { contentCode } = SEARCH_HOT_WORD_CONFIG;
        try {
          const cmsContentMap = await this.getCmsContentMapData();
          const cmsContent = JSON.parse(cmsContentMap[contentCode]) || {};
          const hotWords = get(cmsContent, 'zh_CN.hot_item.modelContents', [])
            .map((v) => ({
              search_type: v.groupContents.hot1[0].fieldContents.search_type,
              search_value: v.groupContents.hot1[0].fieldContents.search_value,
              name: v.groupContents.hot1[0].fieldContents.show,
            }))
          this.hotWords = hotWords;
        } catch (error) {
          console.error(error)
        }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.search-recommend {
  margin-top: rpx(40);
  padding: 0 rpx(16);
  .title {
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: rpx(14);
    font-weight: 500;
    line-height: rpx(20);
    letter-spacing: 2px;
    color: #1d1d1d;
  }
  .hot-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: rpx(-10);
    .item {
      font-family: PingFangSC, PingFangSC-Medium;
      font-size: rpx(14);
      font-weight: 500;
      line-height: rpx(20);
      margin-top: rpx(20);
      margin-left: rpx(10);
      padding: rpx(10) rpx(20);
      letter-spacing: 2px;
      color: #8e8e8e;
      border: rpx(2) solid #bbb;
    }
    .hot {
      color: #1d1d1d;
      border-color: #1d1d1d;
    }
  }
}
.guess-like {
  margin-top: rpx(30);
}

</style>
