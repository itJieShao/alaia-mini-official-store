<template>
  <view class="wish">
    <custom-nav-bar title="心愿单" :head-font-color="false" />
    <view :style="{'padding-top':ktxStatusHeight}">
      <view class="list" v-if="flase">
        <view class="goods-item" v-for="it in 8" :key="it">
          <image src="" mode="aspectFit" :lazy-load="true"></image>
          <view class="goods-label">
            新品
          </view>
          <text class="goods-title">镂空饺子包</text>
          <text class="goods-price">￥27,000</text>
        </view>
      </view>
      <view class="no-list">
        <text class="icon-font icon-logo-alaia_000 logo"></text>
        <text class="empty">心愿单为空</text>
        <text class="tip-text">挑选您喜欢的商品加入心愿单</text>
        <view class="go-button">
          <customButton :btnWidth="340" className="big-btn" @click="handleGoHome">去逛逛</customButton>
        </view>
        <recently-like-products :config="GUESS_LIKE_FAVORITE_CONFIG"/>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import customButton from '@/components/al-button/normal.vue';
  import RecentlyLikeProducts from '@/components/al-recentlyLikeProducts';
  import { GUESS_LIKE_FAVORITE_CONFIG } from '@/constants/cms';
  export default {
    name: 'wish',
    components: {
      customButton,
      RecentlyLikeProducts
    },
    data() {
      return {
        ktxStatusHeight: getApp().globalData.ktxStatusHeight,
        GUESS_LIKE_FAVORITE_CONFIG
      }
    },
    computed: {
      // ...mapGetters('order', ['regionsList']),
    },
    onPullDownRefresh() {
      wx.stopPullDownRefresh(); // 阻止下拉刷新
    },
    onLoad() {
      this.fetchFavoritesList().then(res => {
        console.log(res)
      })
    },
    methods: {
      ...mapActions('user', ['shopApi']),
      ...mapActions('order', ['getRegionsList']),
      ...mapActions('wish', ['fetchFavoritesList']),
    },
  }
</script>

<style lang="scss" scoped>
  $color:#1D1D1D;

  .list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-bottom: 100rpx;

    .goods-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 370rpx;
      color: $color;
      margin-bottom: 40rpx;

      image {
        display: block;
        width: 100%;
        height: 510rpx;
      }

      .goods-label {
        font-family: PingFangSC, PingFangSC-Medium;
        font-size: 24rpx;
        line-height: 28rpx;
        padding: 8rpx;
        border: 2rpx solid $color;
        margin-top: 30rpx;
      }

      .goods-title {
        font-family: PingFangSC, PingFangSC-Regular;
        display: block;
        font-size: 28rpx;
        line-height: 28rpx;
        margin: 24rpx auto;
      }

      .goods-price {
        font-family: PingFangSC, PingFangSC-Regular;
        font-size: 28rpx;
        line-height: 28rpx;
      }
    }
  }


  .no-list {
    text-align: center;
    .icon-font{
      display: block;
      margin: 60rpx auto 30rpx;
      font-size: 80rpx;
      color: #1D1D1D;
    }

    .empty {
      display: block;
      font-size: 36rpx;
      line-height: 50rpx;
      letter-spacing: 2rpx;
      color: $color;
      margin-bottom: 30rpx;
    }

    .tip-text {
      display: block;
      color: #8E8E8E;
      font-size: 28rpx;
      line-height: 40rpx;
      letter-spacing: 4rpx;
    }

    .go-button {
      margin: 100rpx auto 140rpx;
    }
  }
</style>
