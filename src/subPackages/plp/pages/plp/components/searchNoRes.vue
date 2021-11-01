<template>
  <view class="no-res-wrap">
    <view class="txt" v-if="keyWord">共0个作品，筛选条件：{{keyWord}}</view>
    <view class="txt" v-else>共0个作品</view>
    <view class="txt tips">很抱歉，我们未找到与您筛选条件相匹配的内容。</view>
    <view class="btn-wrap" @click="goBack">清空筛选条件</view>
    <view class="no-list">
      <recently-like-products :config="GUESS_LIKE_PLP_CONFIG" />
    </view>
  </view>
</template>

<script>
import RecentlyLikeProducts from '@/components/al-recentlyLikeProducts'
import { GUESS_LIKE_PLP_CONFIG } from '@/constants/cms'

export default {
  props: {
    keyWord: {
      type: String,
      default: '',
    },
  },
  components: {
    RecentlyLikeProducts,
  },
  data () {
    return {
      GUESS_LIKE_PLP_CONFIG,
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
    }
  },
  methods: {
    goBack () {
      uni.navigateBack();
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.no-res-wrap {
  margin-top: rpx(21);
  margin-bottom: rpx(12);
}
.txt {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: rpx(12);
  font-weight: 400;
  line-height: rpx(17);
  padding: 0 rpx(15);
  text-align: left;
  letter-spacing: 1px;
  color: #1d1d1d;
}
.tips {
  margin-top: rpx(30);
  text-align: center;
  color: #1d1d1d;
}
.btn-wrap {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: rpx(14);
  font-weight: 400;
  line-height: rpx(20);
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  width: rpx(165);
  height: rpx(40);
  margin: 0 auto;
  margin-top: rpx(70);
  text-align: left;
  color: #1d1d1d;
  border: rpx(2) solid #1d1d1d;
}
.no-list {
  margin-top: 100upx;
  padding-bottom: calc(100rpx + var(--safe-area-inset-bottom));
  text-align: center;
  color: #1d1d1d;
}

</style>
