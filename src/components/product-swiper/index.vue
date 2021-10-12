<template>
  <div class="swiper-component-container">
    <template v-if="products.length > 2">
      <div class="left-side-container" @click="handlePrevSwiper">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_left.png"></image>
      </div>
      <div class="right-side-container" @click="handleNextSwiper">
        <image src="http://res-tasaki.baozun.com/static/images/shopping-car/arrow_right.png"></image>
      </div>
    </template>
    <swiper
      :circular="true"
      :current="current"
      class="swiper-container"
      :display-multiple-items="displayItems"
      @change="handleSwiperChange"
      :style="{width: swiperWidth}"
    >
      <swiper-item v-for="item in products" :key="item.code" @click="handleProductClick(item)">
        <div class="swiper-item-container" >
            <div class="image-wrap">
              <image
                :src="imgUrlReplace(item.productImg, 375, 375)"
                :lazy-load="true"
                mode="aspectFit"
                class="swiper-item"
              ></image>
            </div>
          <div class="product-name">
            {{ item.productName }}
          </div>
          <div class="product-pirce" v-show="item.productPrice">￥{{ priceFormat(item.productPrice) || 0 }}</div>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { priceFormat, imgUrlReplace } from '@/utils/utils';

export default {
  name: 'productSwiper',
  props: {
    products: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      current: 0,
    };
  },
  methods: {
    priceFormat,
    imgUrlReplace,
    handleSwiperChange(event) {
      this.current = event.detail.current;
    },
    handleNextSwiper() {
      this.current += 1
      if (this.current >= this.products.length) {
        this.current = 0
      }
    },
    handlePrevSwiper() {
      this.current -= 1
      if (this.current < 0) {
        this.current = this.products.length - 1
      }
    },
    handleProductClick(item) {
      this.$emit('clickItem', item)
    },
  },
  computed: {
    displayItems() {
      return this.products.length < 2 ? 1 : 2
    },
    swiperWidth() {
      return this.products.length < 2 ? '375rpx' : 'auto'
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-component-container {
  position: relative;
  border: 2rpx solid transparent;
  // margin-top: 120rpx;
  margin-bottom: 100rpx;
  min-height: 400rpx;
  .left-side-container {
    position: absolute;
    top: 33%;
    left: 10rpx;
    z-index: 2;
    image {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .right-side-container {
    position: absolute;
    top: 33%;
    right: 10rpx;
    z-index: 2;
    image {
      width: 40rpx;
      height: 40rpx;
    }
  }
}

.swiper-container {
  height: 530rpx;
  overflow: visible;
  // margin: 120rpx 60rpx;
  // margin-left: 60rpx;
  // margin-right: 60rpx;
  swiper-item {
    position: relative;
    text-align: center;
    .product-name,
    .product-price {
      font-size: 28rpx;
      padding: 0 20rpx;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .product-name {
      margin-top: 24rpx;
      margin-bottom: 32rpx;
    }
  }
}

.swiper-item-container {
  /*margin: 0 60rpx;*/
  /*height: 450rpx;*/
  /*height: 355rpx;*/
  .image-wrap {
    height: 375rpx;
    overflow: hidden;
    image {
      width: 375rpx;
      height: 375rpx;
    }
  }
}

.swiper-item {
  width: 100%;
}

.swiper-dots {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
  .swiper-dots-item {
    width: 18rpx;
    height: 18rpx;
    margin-right: 14rpx;
    border-radius: 50%;
    background-color: #fff;
    border: 2rpx solid #252525;
  }
  .active {
    background-color: #252525;
  }
}
</style>
