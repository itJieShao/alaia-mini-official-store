<template>
  <view class="wish">
    <custom-nav-bar title="心愿单" :head-font-color="false" />
    <view :style="{'padding-top':ktxStatusHeight}" v-if="!isLoading">
      <view class="list" v-if="list.length">
        <view class="goods-item" @click="goPdp(item.product.code)" v-for="(item,index) in list" :key="item.id">
          <view class="collection" @click.stop="delItem(item.id,index)">
            <text class="icon-font icon-shoucangchenggong1"></text>
          </view>
          <image :src="item.product.images[0].url" mode="aspectFit" :lazy-load="true"></image>
          <view class="goods-label">
            新品
          </view>
          <text class="goods-title">{{item.product.title}}</text>
          <text class="goods-price"
            v-if="item.product.skus &&　item.product.skus.length>0 &&　item.product.skus[0].salePrice.amount">￥{{item.product.skus[0].salePrice.amount | formatMoney}}</text>
        </view>
      </view>
      <view class="no-list" v-else>
        <text class="icon-font icon-logo-alaia_000 logo"></text>
        <text class="empty">心愿单为空</text>
        <text class="tip-text">挑选您喜欢的商品加入心愿单</text>
        <view class="go-button">
          <customButton :btnWidth="340" className="big-btn" @click="handleGoHome">去逛逛</customButton>
        </view>
        <recently-like-products :config="GUESS_LIKE_FAVORITE_CONFIG" />
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex';
  import customButton from '@/components/al-button/normal.vue';
  import RecentlyLikeProducts from '@/components/al-recentlyLikeProducts';
  import {
    GUESS_LIKE_FAVORITE_CONFIG
  } from '@/constants/cms';
  import {
    priceFormat
  } from '@/utils/utils';
  export default {
    name: 'wish',
    components: {
      customButton,
      RecentlyLikeProducts
    },
    data() {
      return {
        ktxStatusHeight: getApp().globalData.ktxStatusHeight,
        GUESS_LIKE_FAVORITE_CONFIG,
        list: [],
        isLoading:true,
      }
    },
    computed: {
      // ...mapGetters('order', ['regionsList']),
    },
    filters: {
      formatMoney(val) {
        if (val) {
          return priceFormat(val);
        }
        return '0';
      },
    },
    onPullDownRefresh() {
      wx.stopPullDownRefresh(); // 阻止下拉刷新
    },
    onLoad() {
      this.fetchFavoritesList().then(res => {
        this.isLoading = false;
        this.list = res.map(item => item.node);
      })
      // this.createFavorite({
      //   spuCode: "ZW2S0393VNWL62",
      // })
    },
    methods: {
      ...mapActions('user', ['shopApi']),
      ...mapActions('order', ['getRegionsList']),
      ...mapActions('wish', ['fetchFavoritesList', 'createFavorite', 'delFavorite']),
      delItem(id, index) {
        this.delFavorite(id).then(res => {
          this.list.splice(index, 1);
          uni.showToast({
            title: "该商品已从心愿单中移除",
            icon: "none",
            duration: 1000
          })
        })
      },
      goPdp(spuCodes){
        if (!spuCodes) return;
        uni.navigateTo({
          url: `/subPackages/pdp/pages/pdp/index?code=${spuCodes}`,
        });
      },
      handleGoHome(){
        uni.switchTab({
          url:"/pages/index/index"
        })
      },
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
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 370rpx;
      color: $color;
      margin-bottom: 40rpx;

      .collection {
        position: absolute;
        z-index: 1;
        top: 20rpx;
        right: 20rpx;

        .icon-font {
          font-size: 34rpx;
        }
      }

      image {
        display: block;
        width: 100%;
        height: 510rpx;
        background-color: #f7f7f7;
      }

      .goods-label {
        font-family: PingFangSC, PingFangSC-Medium;
        font-size: 24rpx;
        line-height: 28rpx;
        padding: 8rpx;
        margin-top: 30rpx;
        font-weight: bold;
      }

      .goods-title {
        font-family: PingFangSC, PingFangSC-Regular;
        display: block;
        font-size: 28rpx;
        line-height: 40rpx;
        margin: 32rpx auto 24rpx;
        text-align: center;
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

    .icon-font {
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
