<template>
  <view>
    <swiper class="swiper" :current="currentIndex" @change="swiperChange" circular>
      <swiper-item class="swiper-item" v-for="i in 3" :key="i">
        <image src="" mode="aspectFit"></image>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
  
</script>
<style lang="scss" scoped>
  .swiper{
    width: 750rpx;
    height: 642rpx;
    .swiper-item{
      width: 100%;
      height: 100%;
      image{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>