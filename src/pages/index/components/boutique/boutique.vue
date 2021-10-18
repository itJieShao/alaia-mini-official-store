<template name="boutique">
  <view class="boutique">
      <view class="title">
        <text class="main-title">ALAÏA精品店</text>
      </view>
      <image  class="boutique-img" :src="'https://res-tasaki.baozun.com/static/images/boutique-750-996.jpg'"  mode="widthFix" :lazy-load="true" />
      <view class="font-content">
        <text>
          在世界各地寻找我们的精品店，在 Alaïa 商店体验
        </text>
        <text>
          独特的体验。
        </text>
      </view>
      <view class="home-more-btn">
        <customButton :btnWidth="280" :btnHeight="80" className="transparent" @click="goStoreList">即刻查找</customButton>
      </view>
  </view>
</template>
<script>
import customButton from '@/components/button/normal.vue';
import ComTitle from '../comTitle/comTitle';

export default {
  name: 'boutique',
  components: {
    ComTitle,
    customButton,
  },
  props: {

  },
  data() {
    return {};
  },
  methods: {
    goStoreList() {
      uni.navigateTo({
        url: '/subPackages/store-list/pages/store-list/index',
      })
    },
  },
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
$color: #1D1D1D;
// 精品店
.boutique {
  background-color: #fff;
  padding-bottom: 110rpx;
  .title {
    padding: 118rpx 0 44rpx;
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
  .boutique-img {
    width: 100%;
  }
  .font-content{
    padding: 60rpx 0 52rpx;
    text{
      display: block;
      font-size: 28rpx;
      line-height: 34rpx;
      color: $color;
      text-align: center;
    }
  }
}
</style>
