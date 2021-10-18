<template>
  <view class="product">
    <view class="title">
      <text class="main-title">精选.推荐</text>
      <text class="subtitle">YOU MAY ALSO LIKE</text>
    </view>
    <image class="banner" src="" mode="aspectFill"></image>
    <view id="navbar" class="product-tab">
      <text @click="changeTab(index)" :class="item.checked?'act':''" v-for="(item,index) in tabList"
        :key="index">{{item.name}}</text>
    </view>
    <view class="product-content">
      <view class="product-item" v-for="i in 6" :key="i">
        <image src="" mode="aspectFit"></image>
        <view class="goods-label">
          新品
        </view>
        <text class="goods-title">镂空饺子包</text>
        <text class="goods-price">￥27,000</text>
      </view>
    </view>
  </view>
</template>

<script>
  import customButton from '@/components/button/normal.vue';
  export default {
    data() {
      return {
        tabList: [{
          name: "新品",
          checked: true
        }, {
          name: "成衣",
          checked: false
        }, {
          name: "包袋",
          checked: false
        }, {
          name: "鞋履",
          checked: false
        }, {
          name: "配件",
          checked: false
        }]
      }
    },
    components: {
      customButton,
    },
    methods: {
      changeTab(index) {
        this.tabList.forEach(item => {
          item.checked = false;
        })
        this.$set(this.tabList[index], 'checked', true);
      },
    }
  }
</script>

<style lang="scss" scoped>
  $color: #1D1D1D;

  .product {
    background-color: #fff;

    .title {
      padding: 122rpx 0 40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: $color;

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

    .banner {
      display: block;
      width: 750rpx;
      height: 480rpx;
    }

    .product-tab {
      position: sticky;
      top: 0;
      width: 100%;
      height: 84rpx;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background-color: #fff;
      
      text {
        display: block;
        height: 100%;
        line-height: 84rpx;
        color: #8E8E8E;
        font-size: 28rpx;
        padding: 0 20rpx;
      }

      .act {
        color: $color;
        font-weight: bold;
        border-bottom: 2rpx solid $color;
      }
    }

    .product-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .product-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 370rpx;
        color: $color;
        margin-bottom: 40rpx;
        image {
          display: block;
          width: 100%;
          height: 510rpx;
          background-color: #F7F7F7;
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
</style>
