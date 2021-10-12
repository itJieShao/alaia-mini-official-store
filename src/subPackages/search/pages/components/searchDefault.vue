<template>
  <view>
    <search-input @getProduct="getProduct" />
    <view class="search-recommend">
      <text class="search-recommend-title">热词搜索</text>
      <view class="search-recommend-con">
        <view @click="searchClick(item)" class="search-recommend-item" style="background-color: #E3F0EA;"
          v-for="(item,index) in hotWords" :key="index">
          {{item.name}}
        </view>
      </view>
    </view>
    <view class="search-recommend">
      <view style="width: 680upx;display: flex;align-items: center;justify-content: space-between;"
        v-if="historyWords.length">
        <text class="search-recommend-title">搜索历史</text>
        <image @click="delHistoryWords" style="width: 24rpx;height: 24rpx;"
          src="https://res-tasaki.baozun.com/static/images/icon-del.png" mode="widthFix" :lazy-load="true"></image>
      </view>
      <view class="search-recommend-con">
        <view @click="searchClick(item)" class="search-recommend-item" style="background-color: #E6E6E6;"
          v-for="(item,index) in historyWords" :key="index">
          {{item.name}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import searchInput from '@/components/searchInput';
  export default {
    components: {
      searchInput
    },
    props: {
      hotWords: {
        type: Array,
        default: [],
      },
      historyWords: {
        type: Array,
        default: [],
      },
    },
    methods: {
      getProduct(params) {
        this.$emit("getProduct", params);
      },
      searchClick(keyword) {
        console.log("searchClick",keyword)
        this.$emit("getProduct", keyword);
        this.$sr.track("search", {
          keyword:keyword.name,
        });
      },
      delHistoryWords() {
        this.$emit("delHistoryWords");
      },
    }
  }
</script>

<style lang="scss" scoped>
  .search-recommend {
    width: 720upx;
    margin: 50upx 0 40upx 30upx;

    text,
    view {
      font-family: 'HiraginoSansGB';
    }

    .search-recommend-title {
      font-size: 28upx;
      color: #1D1D1D;
    }

    .search-recommend-con {
      margin-top: 28upx;
      display: flex;
      flex-wrap: wrap;

      .search-recommend-item {
        margin: 0 30upx 30upx 0;
        font-size: 24upx;
        text-align: center;
        line-height: 24upx;
        letter-spacing: 1.44upx;
        padding: 16upx 20upx;
        border-radius: 5upx;
      }
    }
  }
</style>
