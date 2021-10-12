  // <!-- 首页产品轮播 -->
<template name="productSwiperOne">
    <view class="product-swiper-one" v-if="list && list.length > 0">
      <!-- <view class="product-swiper-one-header">
        <view class="product-swiper-one-title"><text>{{title}}</text></view>
        <view class="product-swiper-one-subtitle" ><text>{{subTitle}}</text></view>
      </view> -->
      <!-- 轮播图 -->
      <swiper class="swiper" :indicator-dots="false" :autoplay="false" :circular="true" :current="currentIndex" @change="swiperChange" v-if="list.length >1">
        <block v-for="(swiperItem , index) in list" :key="index">
          <swiper-item class="product-swiper-one-item" @click="goPDP(swiperItem)">
            <image class="swiper-image" :src="swiperItem.picLink" mode="widthFix" :lazy-load="true"/>
            <!-- <view class="product-swiper-one-body">
              <image  class="product-swiper-one-img" :src="swiperItem.imageUrl"   mode="scaleToFill"   />
              <image class="product-swiper-one-img-assist" :src="swiperItem.subImageUrl" mode="" />
            </view>
            <view class="product-swiper-one-footer">
              <view class="product-swiper-one-name">{{swiperItem.name}}</view>
              <view class="product-swiper-one-price">{{swiperItem.price}}</view>
              <customButton class="product-swiper-one-btn" :btnWidth="240" :btnHeight="70" className="transparent" @click="goPDP">{{swiperItem.btn.text}}</customButton>
            </view> -->
          </swiper-item>
        </block>
      </swiper>
      <!-- 不轮播 -->
      <block v-if="list.length == 1">
        <view class="product-swiper-one-item" v-for="(swiperItem , index) in list" :key="index" @click="goPDP(swiperItem)">
          <image class="swiper-image" :src="swiperItem.picLink" mode="widthFix" :lazy-load="true"/>
          <!-- <view class="product-swiper-one-body">
            <image  class="product-swiper-one-img" :src="swiperItem.imageUrl"   mode="scaleToFill"   />
            <image class="product-swiper-one-img-assist" :src="swiperItem.subImageUrl" mode="" />
          </view>
          <view class="product-swiper-one-footer">
            <view class="product-swiper-one-name">{{swiperItem.name}}</view>
            <view class="product-swiper-one-price">{{swiperItem.price}}</view>
            <customButton class="product-swiper-one-btn" :btnWidth="280" :btnHeight="80" className="transparent" @click="goPDP">{{swiperItem.btn.text}}</customButton>
          </view> -->
        </view>
      </block>
      <!-- 左箭头 -->
      <view class="swiper-arrow swiper-arrow-left" @click="changeSwiper('left')" v-if="list.length > 1">
        <text class="icon-font icon-icon-zuo"></text>
      </view>
      <!-- 右箭头 -->
      <view class="swiper-arrow swiper-arrow-right" @click="changeSwiper('right')" v-if="list.length > 1">
        <text class="icon-font icon-icon-youjiantou"></text>
      </view>

    </view>
</template>

<script>
// import ComTitle from '../comTitle/comTitle';
import customButton from '@/components/button/normal.vue';

export default {
  name: 'productSwiperOne',
  components: {
    // ComTitle,
    customButton,
  },
  props: {
    productSwiperOneList: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    productSwiperOneList: {
      deep: true,
      immediate: true,
      handler(n, o) {
        console.log('productSwiperOneList', n)
        this.list = this.productSwiperOneList
      },
    },
  },
  data() {
    return {
      title: 'balance平衡系列再添新作',
      subTitle: 'TASAKI全新设计，结合精湛技艺与天马行空的创造力',
      list: [],
      currentIndex: 0,
    };
  },

  methods: {
    changeSwiper(position) {
      if (position === 'left') {
        if (this.currentIndex === 0) {
          this.currentIndex = this.list.length - 1;
        } else {
          this.currentIndex = this.currentIndex - 1;
        }
      } else if (position === 'right') {
        if (this.currentIndex === this.list.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex = this.currentIndex + 1;
        }
      }
    },
    swiperChange(e) {
      console.log('swiperChange ====>', this.currentIndex);
      // this.currentIndex = e.detail.current;
    },
    goPDP(item) {
      this.$emit('youshuReport', 'trigger_sku_component', item);
      if (item.spuCodes && item.spuCodes.length > 0) {
        this.$emit('click', item.spuCodes[0]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
  // 首页产品swiper
  .product-swiper-one {
    position: relative;
    padding: 0 0 90rpx;
    .product-swiper-one-header {
      font-size: 44rpx;
      color: #1d1d1d;
      line-height: 44rpx;
      text-align: center;
      .product-swiper-one-subtitle {
        font-size: 28rpx;
        line-height: 30rpx;
        margin-top: 36rpx;
      }
    }
    .swiper{
      height: 1220rpx;
    }
    .product-swiper-one-item{
      .product-swiper-one-body {
        position: relative;
        padding: 80rpx 96rpx 36rpx;
        height: 956rpx;
        .product-swiper-one-img {
          width: calc(100vw - 192rpx);
          height: 690rpx;
          border: 10px solid $mainColor;
          box-sizing: border-box;
        }
        .product-swiper-one-img-assist{
          position: absolute;
          bottom: 36rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 400rpx;
          height: 400rpx;

        }
      }
      .product-swiper-one-footer {
        color: #1d1d1d;
        text-align: center;
        .product-swiper-one-name {
          font-size: 36rpx;
          line-height: 36rpx;
        }
        .product-swiper-one-price {
          font-size: 28rpx;
          line-height: 34rpx;
          margin-top: 40rpx;
          font-weight: 300;
          margin-bottom: 54rpx;
        }
        .product-swiper-one-btn {
          // margin-top: 54rpx;
        }
      }
      .swiper-image{
        width: calc(100vw);
      }
    }
    .swiper-arrow{
      width: 50rpx;
      height: 50rpx;
      line-height: 50rpx;
      &.swiper-arrow-left{
        position:absolute;
        left: 26rpx;
        top: 50%;
        transform: translateY(-50%);
      }
      &.swiper-arrow-right{
        position:absolute;
        right: 26rpx;
        top: 50%;
        transform: translateY(-50%);
        text-align: right;

      }
    }
  }

</style>
