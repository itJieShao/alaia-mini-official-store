<template>
  <view class="product-model">
    <view class="title">
      <text class="main-title">造型.灵感</text>
      <text class="subtitle">Shop the Look</text>
    </view>
    <view class="product">
      <view class="product-item" v-for="i in 6" :key="i">
        <image class="product-img" src="" mode="aspectFit"></image>
      </view>
    </view>
    <view class="change-model">
      <text>换一批</text>
    </view>
  </view>
</template>

<script>
</script>

<style lang="scss" scoped>
  $color: #1D1D1D;

  .product-model {
    background-color: #fff;
    .title {
      padding: 100rpx 0 40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: $color;
      background-color: #fff;

      .main-title {
        font-size: 48rpx;
        line-height: 66rpx;
        letter-spacing: 2rpx;
        font-weight: bold;
      }

      .subtitle {
        margin-top: 14rpx;
        font-size: 28rpx;
        line-height: 40rpx;
        letter-spacing: 2rpx;
      }
    }

    .product {
      width: 750rpx;
      display: flex;
      flex-wrap: wrap;

      .product-item {
        width: 50%;
        height: 516rpx;

        .product-img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }

    .change-model {
      display: flex;
      justify-content: center;
      margin-top: 68rpx;
      text{
        font-size: 28rpx;
        line-height: 40rpx;
        color: $color;
        border-bottom: 2rpx solid $color;
      }
    }
  }
</style>
