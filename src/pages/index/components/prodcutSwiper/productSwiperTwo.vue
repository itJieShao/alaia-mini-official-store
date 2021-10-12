  // <!-- 首页产品轮播 -->
<template name="productSwiperTwo">
  <view class="product-swiper-two">
      <com-title :title="seriesTitle"></com-title>
      <!-- bar -->
      <scroll-bar :current="scrollIndex" @click="tabClick" :scrollBarList="scrollBarList" v-if="scrollBarList.length > 0"></scroll-bar>
      <block  v-if="list && list.length > 0">
        <!-- 图片轮播 -->
        <swiper class="swiper" :autoplay="false" :circular="true" :current="currentIndex" v-if="list.length > 1" @change="swiperChange">
          <block v-for="(swiperItem,swiperIndex) in list" :key="swiperIndex">
            <swiper-item  class="swiper-item" @click="goPdp(swiperItem)">
              <image class="swiper-image" :src="swiperItem.picLink" mode="widthFix" :lazy-load="true"/>
              <!-- <view  class="swiper-item-content">
                <image class="swiper-item-img" :src="swiperItem.imageUrl" mode="widthFix" />
                <view class="prd-info">
                  <view class="prd-title">{{swiperItem.name}}</view>
                  <view class="prd-price">{{swiperItem.price}}</view>
                  <view class="prd-desc">{{swiperItem.desc}}</view>
                  <view class="prd-material">{{swiperItem.material}}</view>
                </view>
              </view> -->
            </swiper-item>
          </block>
        </swiper>
        <!-- 图片不轮播 -->
        <block v-if="list.length == 1">
          <view  class="swiper">
            <view  class="swiper-item"  v-for="(swiperItem,swiperIndex) in list" :key="swiperIndex" @click="goPdp(swiperItem)">
              <image class="swiper-image" :src="swiperItem.picLink" mode="widthFix" :lazy-load="true"/>
              <!-- <view  class="swiper-item-content">
                <image class="swiper-item-img" :src="swiperItem.imageUrl" mode="widthFix" />
                <view class="prd-info">
                  <view class="prd-title">{{swiperItem.name}}</view>
                  <view class="prd-price">{{swiperItem.price}}</view>
                  <view class="prd-desc">{{swiperItem.desc}}</view>
                  <view class="prd-material">{{swiperItem.material}}</view>
                </view>
              </view> -->
            </view>
          </view>
        </block>
        <!-- <customButton :btnWidth="280" :btnHeight="80" className="transparent" @click="goPDP">探索更多</customButton> -->
        <!-- 左箭头 -->
        <view class="swiper-arrow swiper-arrow-left" @click="changeSwiper('left')" v-if="list.length > 1">
          <text class="icon-font icon-icon-zuo"></text>
        </view>
        <!-- 右箭头 -->
        <view class="swiper-arrow swiper-arrow-right" @click="changeSwiper('right')" v-if="list.length > 1">
          <text class="icon-font icon-icon-youjiantou"></text>
        </view>
      </block>
  </view>
</template>

<script>
import customButton from '@/components/button/normal.vue';
import ComTitle from '../comTitle/comTitle';
import ScrollBar from '../scrollBar/scrollBar';

export default {
  name: 'productSwiperTwo',
  components: {
    ComTitle,
    ScrollBar,
    customButton,
  },
  props: {
    productSwiperTwoData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    productSwiperTwoData: {
      deep: true,
      immediate: true,
      handler(n, o) {
        console.log('productSwiperTwoData', n)
        this.seriesTitle = n.name;
        this.scrollBarList = n.children || [];
        console.log('scrollBarList ***** ==>', this.scrollBarList);
        this.list = [];
        if (this.scrollBarList.length > 0) {
          this.scrollBarList.forEach((ele, index) => {
            console.log('ele', ele.children)
            ele.children.forEach((e) => {
              e.parentIndex = index;
              this.list.push(e);
            })
          })
        }
      },
    },
  },
  data() {
    return {
      seriesTitle: '',
      list: [],
      currentIndex: 0,
      scrollBarList: [],
      scrollIndex: 0,
    };
  },
  methods: {
    // 改变轮播
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
      const { current } = e.detail;
      this.scrollIndex = this.list[current].parentIndex;
    },
    // 去详情页
    goPdp(item) {
      this.$emit('youshuReport', 'trigger_sku_component', item);
      this.$emit('click', item.spuCodes[0]);
    },
    // 点击tab
    tabClick(index, item) {
      console.log('tabClick ===>', index, item);
      // this.list = item.children;
      // this.currentIndex = 0;
      let idx = 0;
      if (index > 0) {
        for (let i = 0; i < index; i++) {
          idx += this.scrollBarList[i].children.length;
        }
        this.currentIndex = idx;
      } else {
        this.currentIndex = 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// $fontFamily: GillSansLight, HiraginoSansGB-W3, HiraginoSansGB;
$mainColor: #e3f0ea;
  // 首页产品swiper
  .product-swiper-two {
    position: relative;
    padding: 0 0 50rpx;
    .swiper{
      height: 1000rpx;
      .swiper-item{
        width: 100%;
        height: 100%;
        // padding: 40rpx 74rpx;
        background-color: #fff;
        box-sizing: border-box;
        .swiper-item-content{
          width: 100%;
          height: 100%;
          text-align: center;
          .swiper-item-img{
            width: 400rpx;
            margin: 0 auto;
          }
          .prd-info{
              color: #1D1D1D;
              text-align: center;
            .prd-title{
              font-size: 36rpx;
              line-height: 48rpx;
            }
            .prd-price{
              font-size: 28rpx;
              font-family: PingFangSC;
              font-weight: 300;
              line-height: 40rpx;
              margin-top: 32rpx;
            }
            .prd-desc{
              font-size: 24rpx;
              color: #BBBBBB;
              line-height: 34rpx;
              margin-top: 24rpx;
            }
            .prd-material{
              font-size: 24rpx;
              line-height: 36rpx;
              margin-top: 40rpx;
            }
          }
        }
        .swiper-image{
          width: calc(100vw);
        }

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
