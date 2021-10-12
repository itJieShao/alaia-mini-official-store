<template>
  <view>
    <search-input @getProduct="getProduct" />
    <view class="search-res">
      <text decode class="search-res-title">搜索&nbsp;&nbsp;“{{keyword.name}}”</text>
      <text class="search-res-num" v-if="filterKeyWord">共{{totalCount}}个结果，筛选条件：{{filterKeyWord}}</text>
      <text class="search-res-num" v-else>共{{totalCount}}个结果</text>
    </view>
    <goods-list :goodsList="goodsList" @updateList="updateList" @goFilter="goFilter" />
    <view class="logo-box">
      <view>
        TASAKI
      </view>
    </view>
    <view v-if="goTopFlag" class="goTop" @click="scrollToTop">
      <text class="icon-font icon-icon-yijianxiangshang"></text>
    </view>
  </view>
</template>

<script>
  import searchInput from '@/components/searchInput';
  import goodsList from '@/components/goodsList';
  export default {
    components: {
      searchInput,
      goodsList
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
        default: "",
      },
      goodsList: {
        type: Array,
        default: [],
      },
    },
    methods: {
      getProduct(params) {
        this.$emit("getProduct", params, 1);
      },
      updateList(type, sort) {
        this.$emit("updateList", type, sort);
      },
      goFilter() {
        this.$emit("goFilter");
      },
      scrollToTop() {
        this.$emit("scrollToTop");
      }
    },
  }
</script>

<style lang="scss" scoped>
  .search-res {
    text {
      display: block;
      font-family: 'HiraginoSansGB';
    }

    .search-res-title {
      width: 680upx;
      padding-top: 50upx;
      margin: 0 auto;
      font-size: 32upx;
      color: #1D1D1D;
    }

    .search-res-num {
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      width: 680upx;
      margin: 30upx auto 50upx;
      font-size: 24upx;
      color: #666;
    }
  }

  .logo-box {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20upx 0 60upx;

    view {
      font-size: 28upx;
      color: #050101;
      border-bottom: 8upx solid #E3F0EA;
      padding: 6upx 20upx;
      letter-spacing: 6upx;
    }
  }

  .goTop {
    position: fixed;
    right: 34rpx;
    bottom: 54rpx;

    text {
      display: inline-block;
      border-radius: 50%;
      width: 62rpx;
      height: 62rpx;
      background: #FFFFFF;
      box-shadow: 0px 6px 20px 0px rgba(102, 102, 102, 0.1);
      text-align: center;
      line-height: 62rpx;

      .icon-font {
        font-size: 36rpx;
      }
    }
  }
</style>
