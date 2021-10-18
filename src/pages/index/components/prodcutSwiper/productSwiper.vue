<template>
  <view class="product-swiper">
    <view class="title">
      <com-title title="2022艺术的馈赠" subtitle="新品女士包袋" />
    </view>
    <view class="swiper-container">
      <swiper class="swiper" autoplay interval="3000" :current="currentIndex" @change="swiperChange" circular>
        <swiper-item class="swiper-item twoItem" v-for="i in 3" :key="i">
          <view class="goods-item" v-for="it in 2" :key="it">
          <!-- <view class="goods-item"> -->
            <image src="" mode="aspectFit" :lazy-load="true"></image>
            <view class="goods-label">
              新品
            </view>
            <text class="goods-title">镂空饺子包</text>
            <text class="goods-price">￥27,000</text>
          </view>
        </swiper-item>
      </swiper>
      <view class="left-side" @click="changeLeftSide">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_left.png"></image>
      </view>
      <view class="right-side" @click="changeRightSide">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_right.png"></image>
      </view>
      <view class="view-dost">
        <view class="swiper-dots-warp">
          <view class="swiper-dots" :style="{ width:dotsWidth + 'px',left:dotsLeft + 'px' }"></view>
        </view>
      </view>
      <view class="home-more-btn">
        <customButton :btnWidth="480" :btnHeight="80" className="transparent">即刻探索</customButton>
      </view>
    </view>
  </view>
</template>

<script>
  import ComTitle from '../comTitle/comTitle';
  import customButton from '@/components/button/normal.vue';
  export default {
    data() {
      return {
        swiperList: [1, 2, 3],
        currentIndex: 0,
      }
    },
    components: {
      ComTitle,
      customButton,
    },
    computed: {
      dotsWidth() {
        return this.swiperList.length > 0 ? 160 / this.swiperList.length : 160;
      },
      dotsLeft() {
        return this.swiperList.length > 0 ? 160 / this.swiperList.length * this.currentIndex : 0;
      },
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

  .product-swiper {

    .title {
      padding: 90rpx 0 60rpx;
    }

    .swiper-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;

      .swiper {
        width: 674rpx;
        height: 700rpx;

        .oneItem{
          justify-content: center;
        }
        .twoItem{
          justify-content: space-between;
        }
        .swiper-item {
          width: 100%;
          display: flex;
          .goods-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 330rpx;
            color: $color;

            image {
              display: block;
              width: 100%;
              height: 456rpx;
            }

            .goods-label {
              font-size: 24rpx;
              line-height: 28rpx;
              padding: 8rpx;
              border: 2rpx solid $color;
              margin-top: 30rpx;
            }

            .goods-title {
              display: block;
              font-size: 28rpx;
              line-height: 28rpx;
              margin: 24rpx auto;
            }

            .goods-price {
              font-size: 28rpx;
              line-height: 28rpx;
            }
          }
        }
      }

      .left-side {
        position: absolute;
        top: 250rpx;
        left: 10rpx;
        z-index: 2;
        image{
          width: 36rpx;
          height: 36rpx;
        }
      }

      .right-side {
        position: absolute;
        top: 250rpx;
        right: 10rpx;
        z-index: 2;
        image{
          width: 36rpx;
          height: 36rpx;
        }
      }

      // 滚动条
      .view-dost {
        width: 100%;
        text-align: center;
        word-wrap: break-word;

        .swiper-dots-warp {
          position: relative;
          width: 160px;
          height: 2px;
          margin: 0 auto;
          transform: scaleY(.5);
          background: #d8d8d8;

          .swiper-dots {
            position: absolute;
            top: 50%;
            left: 0;
            width: 32px;
            height: 3px;
            transition: all .8s;
            transform: translateY(-50%);
            text-align: center;
            background: #1d1d1d;
          }
        }
      }

      .home-more-btn {
        padding: 60rpx 0 90rpx;
      }
    }
  }
</style>
