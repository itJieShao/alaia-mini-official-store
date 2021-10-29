<template>
  <view class="product-model">
    <view class="title">
      <com-title title="造型.灵感" subtitle="SHOP THE LOOK" />
    </view>
    <view class="product">
      <view class="product-item" v-for="(item,index) in homeStyleInspiration" :key="index" @click="goDetail(index)">
        <image class="product-img" :src="item.resources[0].url" mode="aspectFit"></image>
        <view class="shopbag">
          <text class="icon-font icon-shopbag"></text>
        </view>
      </view>
    </view>
    <view class="change-model" @click="changeModel">
      <text>换一批</text>
    </view>
  </view>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ComTitle from '../comTitle/comTitle';
  import { HOME_STYLING_INSPIRATION_TITLE_CONFIG } from '@/constants/cms';
  export default {
    props:{
      homeStyleInspiration:{
        type:Array,
        default:[],
      }
    },
    data(){
      return{

      }
    },
    computed: {
      ...mapGetters('cms', ['cmsContentMap']),
    },
     watch: {
      cmsContentMap (newValue) {
        // todo: 这里进行数据绑定 HOME_STYLING_INSPIRATION_TITLE_CONFIG
        console.log(newValue)
      }
    },
    components: {
      ComTitle
    },
    methods:{
      goDetail(index){
        uni.navigateTo({
          url:`/subPackages/productCollocation/pages/index?index=${index}`
        })
      },
      changeModel(){
        this.$emit("changeModel")
      },
    }
  }
</script>

<style lang="scss" scoped>
  $color: #1D1D1D;

  .product-model {
    background-color: #fff;
    .title {
      padding: 100rpx 0 40rpx;
    }

    .product {
      width: 750rpx;
      display: flex;
      flex-wrap: wrap;

      .product-item {
        position: relative;
        width: 50%;
        height: 516rpx;

        .product-img {
          display: block;
          width: 100%;
          height: 100%;
        }
        .shopbag{
          position: absolute;
          left: 19rpx;
          bottom: 19rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56rpx;
          height: 56rpx;
          background-color: rgba(0,0,0,.1);
          border: 2rpx solid #fff;
          border-radius: 50%;
          .icon-shopbag{
            font-size: 44rpx;
            color: #fff;
          }
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
