<template>
  <view>
    <custom-nav-bar title=" " :head-font-color="false" :head-border="false" :head-blank="true" />
    <view class="swiper-container">
      <swiper class="swiper" :current="currentIndex" @change="swiperChange" circular>
        <swiper-item class="swiper-item" v-for="(item,index) in homeStyleInspiration" :key="index">
          <image :src="item.resources[0].url" mode="aspectFill"></image>
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
      <view class="product-item" @click="goPdp(item.code)" :class="item.bgClass?'product-bg':''" v-for="(item,index) in productbyCodesList"
        :key="index">
        <image :src="item.images[0].url" mode="aspectFit" :lazy-load="true"></image>
        <view class="goods-title" v-if="item.title">{{item.title}}</view>
        <view class="goods-price" v-if="item.skus &&　item.skus.length>0 &&　item.skus[0].salePrice.amount">¥
          {{item.skus[0].salePrice.amount | formatMoney}}
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex';
  import {
    priceFormat
  } from '@/utils/utils';
  export default {
    data() {
      return {
        currentIndex: 0,
        productbyCodesList: [],
      }
    },
    computed: {
      ...mapGetters('product', ['homeStyleInspiration']), //造型灵感数据
    },
    watch: {
      currentIndex(index) {
        if (this.homeStyleInspiration[index].hasOwnProperty("productbyCodesList")) {
          this.productbyCodesList = this.homeStyleInspiration[index].productbyCodesList
        } else {
          this.getProductList(this.homeStyleInspiration[index].codes).then((res) => {
            for (let i = 0; i < res.length; i += 3) {
              res[i].bgClass = true;
            }
            this.$set(this.homeStyleInspiration[index], "productbyCodesList", res);
            this.productbyCodesList = res;
          })
        }
      },
    },
    filters: {
      formatMoney(val) {
        if (val) {
          return priceFormat(val);
        }
        return '0';
      },
    },
    onLoad(option) {
      this.currentIndex = option.index;
    },
    methods: {
      ...mapActions('product', ['getProductList']),
      swiperChange(e) {
        this.currentIndex = e.detail.current;
      },
      changeLeftSide() {
        this.currentIndex = this.currentIndex > 0 ? --this.currentIndex : this.homeStyleInspiration.length - 1;
      },
      changeRightSide() {
        this.currentIndex = this.currentIndex === this.homeStyleInspiration.length - 1 ? 0 : ++this.currentIndex;
      },
      goPdp(spuCodes){
        if (!spuCodes) return;
        uni.navigateTo({
          url: `/subPackages/pdp/pages/pdp/index?code=${spuCodes}`,
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '@/styles/utilities.scss';
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

    .product-bg {
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
        width: 90%;
        text-align: center;
        display: block;
        font-size: 28rpx;
        line-height: 40rpx;
        margin: 64rpx auto 20rpx;
      }

      .goods-price {
        font-size: 28rpx;
        line-height: 28rpx;
        margin-bottom: 20rpx;
      }
    }
  }
</style>
