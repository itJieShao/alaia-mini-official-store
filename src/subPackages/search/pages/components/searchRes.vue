<template>
  <view>
    <view class="search-res">
      <text decode class="search-res-title">关键词“{{keyword.name}}”</text>
      <text class="search-res-num" v-if="filterKeyWord">共{{totalCount}}件商品，筛选条件：{{filterKeyWord}}</text>
      <text class="search-res-num" v-else>共{{totalCount}}件商品</text>
    </view>
    <goods-list :goodsList="goodsList" noFilter />
    <view v-if="goTopFlag" class="goTop" @click="scrollToTop">
      <text class="icon-font icon-icon-yijianxiangshang"></text>
    </view>
  </view>
</template>

<script>
import goodsList from '@/components/goodsList';

export default {
  components: {
    goodsList,
  },
  props: {
    goTopFlag: {
      type: Boolean,
      default: false,
    },
    totalCount: {
      type: Number,
      default: 0,
    },
    keyword: {
      type: Object,
      default: {},
    },
    filterKeyWord: {
      type: String,
      default: '',
    },
    goodsList: {
      type: Array,
      default: [],
    },
  },
  methods: {
    scrollToTop () {
      this.$emit('scrollToTop');
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.search-res {
  display: flex;
  align-items: center;
  padding: rpx(19) rpx(16);
  .search-res-title {
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: rpx(14);
    font-weight: 500;
    line-height: rpx(20);
    letter-spacing: 2px;
    color: #1d1d1d;
  }
  .search-res-num {
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: rpx(12);
    font-weight: 400;
    line-height: rpx(17);
    overflow: hidden;
    flex: 1;
    white-space: nowrap;
    letter-spacing: 1px;
    text-overflow: ellipsis;
    color: #1d1d1d;
  }
}
.goTop {
  position: fixed;
  right: 34rpx;
  bottom: 54rpx;
  text {
    line-height: 62rpx;
    display: inline-block;
    width: 62rpx;
    height: 62rpx;
    text-align: center;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 6px 20px 0 rgba(102, 102, 102, .1);
    .icon-font {
      font-size: 36rpx;
    }
  }
}

</style>
