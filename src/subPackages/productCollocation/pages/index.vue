<template>
  <view>
    <custom-nav-bar
      title=" "
      :head-font-color="false"
    />
    <view class="swiper-container">
      <swiper class="swiper" :current="currentIndex" @change="swiperChange" circular>
        <swiper-item class="swiper-item" v-for="i in 3" :key="i">
          <image src="" mode="aspectFit"></image>
        </swiper-item>
      </swiper>
      <view class="left-side" @click="changeLeftSide">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_left.png"></image>
      </view>
      <view class="right-side" @click="changeRightSide">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_right.png"></image>
      </view>
    </view>
    <view class="product">
      <view class="product-item" v-for="i in list" :key="i">
        <image src="" mode="aspectFit"></image>
        <text class="goods-title">镂空饺子包</text>
        <text class="goods-price">￥27,000</text>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        currentIndex: 0,
        list: [1,2,3,4],
      }
    },
    methods: {
      swiperChange(e) {
        this.currentIndex = e.detail.current;
      },
      changeLeftSide() {
        this.currentIndex = this.currentIndex > 0 ? --this.currentIndex : this.swiperList.length - 1;
      },
      changeRightSide() {
        this.currentIndex = this.currentIndex === this.swiperList.length - 1 ? 0 : ++this.currentIndex;
      },
    }
  }
</script>
<style lang="scss" scoped>
  $color: #1D1D1D;

  .swiper-container {
    position: relative;

    .swiper {
      width: 750rpx;
      height: 642rpx;

      .swiper-item {
        width: 100%;
        height: 100%;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .left-side {
      position: absolute;
      top: 50%;
      left: 10rpx;
      z-index: 2;

      image {
        width: 36rpx;
        height: 36rpx;
      }
    }

    .right-side {
      position: absolute;
      top: 50%;
      right: 10rpx;
      z-index: 2;

      image {
        width: 36rpx;
        height: 36rpx;
      }
    }
  }


  .product {
    width: 750rpx;
    padding-bottom: 100rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .p-bg {
      background: linear-gradient(#F7F7F7, #EEEEEE);
    }

    .product-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      height: 564rpx;
      color: $color;

      image {
        display: block;
        margin: 40rpx auto 0;
        width: 254rpx;
        height: 350rpx;
      }

      .goods-title {
        display: block;
        font-size: 28rpx;
        line-height: 28rpx;
        margin: 64rpx auto 20rpx;
      }

      .goods-price {
        font-size: 28rpx;
        line-height: 28rpx;
      }
    }
  }
</style>
