  // <!-- 首页产品轮播 -->
<template name="productSwiperThree">
  <view class="product-swiper-three" v-if="list.length > 0">
    <com-title :title="seriesTitle"></com-title>
    <block v-if="list.length > 1">
      <swiper class="swiper" :interval="2000" :duration="500" :circular="true" :current="currentIndex" @change="swiperChange">
        <block v-for="(swiperItem,swiperIndex) in list" :key="swiperIndex">
          <swiper-item >
            <view class="swiper-item" @click="goPdp(swiperItem)">
              <image class="swiper-image" :src="swiperItem.picLink" mode="widthFix" :lazy-load="true"/>

              <!-- <view class="swiper-item-left">
                <image class="swiper-item-left-img" :src="swiperItem.bgImage" mode="heightFix" />
              </view>
              <view class="swiper-item-right">
                <image class="swiper-item-right-img" :src="swiperItem.smImage" mode="" />
                <view class="prd-info">
                  <view class="prd-name">{{swiperItem.name}}</view>
                  <view class="prd-price">{{swiperItem.price}}</view>
                  <view class="prd-btn"><text>{{swiperItem.btn.text}}</text></view>
                </view>
              </view> -->
            </view>
          </swiper-item>
        </block>
      </swiper>
    </block>
    <block v-else>
      <view class="swiper" v-for="(swiperItem,swiperIndex) in list" :key="swiperIndex" @click="goPdp(swiperItem)">
        <view class="swiper-item">
              <image class="swiper-image" :src="swiperItem.picLink" mode="widthFix" :lazy-load="true"/>
        </view>
      </view>
    </block>
    <!-- 滚动条 -->
    <view class="view-dost" v-if="list.length > 1">
      <view class="swiper-dots-warp">
        <view class="swiper-dots"  :style="{ width:dotsWidth + 'px',left:dotsLeft + 'px' }"></view>
      </view>
    </view>
  </view>
</template>

<script>
import ComTitle from '../comTitle/comTitle';

export default {
  name: 'productSwiperThree',
  components: {
    ComTitle,
  },
  computed: {
    dotsWidth() {
      return this.list.length > 0 ? 200 / this.list.length : 200;
    },
    dotsLeft() {
      return this.list.length > 0 ? 200 / this.list.length * this.currentIndex : 0;
    },

  },
  props: {
    productSwiperThreeData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    productSwiperThreeData: {
      deep: true,
      immediate: true,
      handler(n, o) {
        console.log('productSwiperThreeData', n)
        this.seriesTitle = n.name;
        this.list = n.children || [];
      },
    },
  },
  data() {
    return {
      seriesTitle: '',
      currentIndex: 0, // 轮播图所属下标
      list: [],
    };
  },
  methods: {
    swiperChange(e) {
      // console.log('swiperChange ====>', e, this.currentIndex);
      this.currentIndex = e.detail.current;
    },

    // 点击去详情
    goPdp(item) {
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
$transitionAll: all .8s;
// 首页产品swiper
.product-swiper-three {
  height: 876rpx;
  .swiper{
      height: 606rpx;
      .swiper-item {
        height: 606rpx;
        .swiper-item-left{
          float: left;
          height: 100%;
          width: 370rpx;
          overflow: hidden;
          .swiper-item-left-img{
            height: 100%;
          }
        }
        .swiper-item-right{
          float: right;
           height: 100%;
           width: calc(100vw - 370rpx);
           text-align: center;
          .swiper-item-right-img{
            width: 334rpx;
            height: 334rpx;
            margin: 0 auto;
          }
          .prd-info{
            padding-top: 18rpx;
            text-align: center;
            padding: 40rpx;
            box-sizing: border-box;
            .prd-name{
              font-size: 32rpx;
              color: #1D1D1D;
              line-height: 34rpx;
            }
            .prd-price{
              font-size: 28rpx;
              font-weight: 300;
              color: #1D1D1D;
              line-height: 34rpx;
              margin-top: 38rpx;
            }
            .prd-btn{
              font-size: 28rpx;
              color: #1D1D1D;
              line-height: 42rpx;
              margin-top: 70rpx;
              text{
                border-bottom: 1px solid #1D1D1D;
              }
            }
          }
        }
        .swiper-image{
          width: calc(100vw);
        }
      }
  }
  // 滚动条
  .view-dost {
    position: relative;
    z-index: 2;
    width: 100%;
    margin-top: 80rpx;
    text-align: center;
    word-wrap: break-word;

    .swiper-dots-warp {
      width: 200px;
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
        transition: $transitionAll;
        transform: translateY(-50%);
        text-align: center;
        background: #1d1d1d;
      }
    }
  }
}

</style>
