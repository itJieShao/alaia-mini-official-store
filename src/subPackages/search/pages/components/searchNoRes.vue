<template>
  <view>
    <view class="search-res">
      <text decode class="search-res-title">搜索&nbsp;&nbsp;“{{keyword.name}}”</text>
      <text class="search-res-num">共0个结果</text>
      <text class="search-res-font">很抱歉，我们未找到与“{{keyword.name}}”匹配的内容，请尝试其他关键词。</text>
    </view>
    <search-input @getProduct="getProduct" />
    <view class="no-list">
      <recently-like-products />
    </view>
  </view>
</template>

<script>
  import searchInput from '@/components/searchInput';
  import RecentlyLikeProducts from '@/pages/shoppingCar/components/RecentlyLikeProducts'
  export default {
    components: {
      searchInput,
      RecentlyLikeProducts
    },
    props: {
      keyword: {
        type: Object,
        default: {},
      }
    },
    methods: {
      getProduct(params) {
        this.$emit("getProduct", params, 1);
      },
    },
  }
</script>

<style lang="scss" scoped>
  $textColor:#1D1D1D;

  .no-list {
    margin-top: 100upx;
    text-align: center;
    color: $textColor;
    padding-bottom: calc(100rpx + var(--safe-area-inset-bottom));
  }

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
      width: 680upx;
      margin: 30upx auto 0;
      font-size: 24upx;
      color: #666;
    }

    .search-res-font {
      width: 588upx;
      margin: 0 auto;
      color: #0e0e0e;
      font-size: 24upx;
      letter-spacing: 1.72upx;
      line-height: 48upx;
      text-align: center;
      padding: 60upx 0 40upx;
    }
  }

  .goods-recommend {
    width: 700upx;
    margin: 60upx auto;

    .goods-type {
      display: flex;
      flex-direction: column;
      align-items: center;

      .goods-type-icon {
        font-size: 28upx;
        padding: 3upx 20upx;
        border-bottom: 12upx solid #E3F0EA;
        letter-spacing: 5upx;
      }

      .goods-type-name {
        font-size: 34upx;
        color: #0e0e0e;
        margin-top: 20upx;
      }
    }

    .goods-con {
      display: flex;

      .arrow {
        width: 40upx;
        margin-top: 150upx;
      }
    }

    .goods-swiper {
      flex: 1;
      height: 500upx;

      swiper-item {
        display: flex;

        .goods-swiper-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;

          image {
            margin-top: 50upx;
            width: 250upx;
            height: 250upx;
          }

          text {
            display: block;
            margin-top: 20upx;
            color: #1d1d1d;
            text-align: center;
          }
        }
      }
    }
  }
</style>
