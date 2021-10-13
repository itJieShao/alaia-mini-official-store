<template>
  <view>
    <search-input @getProduct="getProduct" />
    <view class="search-recommend">
      <text class="title">热词搜索</text>
      <view class="hot-list">
        <view @click="searchClick(item)" :class="['item',index==0?'hot':'']" v-for="(item,index) in hotWords" :key="index">
          {{item.name}}
        </view>
      </view>
    </view>
    <view class="guess-like">
      <text class="title">猜你喜欢</text>
      <scroll-view class="guess-list" scroll-x="true">
        <view class="item" v-for="(item,index) in guessLike" :key="index">
          <image class="cover" :src="item.cover" mode="aspectFill"></image>
          <view class="title">{{item.title}}</view>
          <view class="price">{{item.price}}</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import searchInput from '@/components/searchInput';

export default {
  components: {
    searchInput,
  },
  props: {
    hotWords: {
      type: Array,
      default: [],
    },
    guessLike: {
      type: Array,
      default: [],
    },
  },
  methods: {
    getProduct (params) {
      this.$emit('getProduct', params);
    },
    searchClick (keyword) {
      this.$emit('getProduct', keyword);
    },
  },
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
  padding-left: rpx(16);
  .title {
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: rpx(14);
    font-weight: 500;
    line-height: rpx(20);
    letter-spacing: 2px;
    color: #1d1d1d;
  }
  .guess-list {
    margin-top: rpx(30);
    white-space: nowrap;
    .item {
      display: inline-block;
      width: rpx(165);
      margin-right: rpx(8);
      text-align: center;
      .cover {
        width: 100%;
        height: rpx(227);
      }
      .title {
        font-family: PingFangSC, PingFangSC-Regular;
        font-size: rpx(12);
        font-weight: 400;
        line-height: rpx(14);
        height: rpx(28);
        margin-top: rpx(15);
        white-space: initial;
        color: #1d1d1d;
      }
      .price {
        font-family: Lato, Lato-Regular;
        font-size: rpx(12);
        font-weight: 400;
        line-height: rpx(14);
        margin-top: rpx(4);
        color: #1d1d1d;
      }
    }
  }
}

</style>
