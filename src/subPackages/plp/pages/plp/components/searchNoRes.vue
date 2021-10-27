<template>
  <view>
    <text class="no-res-font" v-if="keyWord">共0个作品，筛选条件：{{keyWord}}</text>
    <text class="no-res-font" v-else>共0个作品</text>
    <text class="no-res-tip">很抱歉，我们未找到与您筛选条件相匹配的内容。</text>
    <view style="margin-bottom: 140upx;">
      <customButton :btnWidth="330" :btnHeight="80" className="big-btn" @click="goBack">
        清空筛选条件
      </customButton>
    </view>
    <view class="no-list">
      <recently-like-products :config="GUESS_LIKE_PLP_CONFIG"/>
    </view>
  </view>
</template>

<script>
  import customButton from '@/components/button/normal.vue'
  import RecentlyLikeProducts from '@/components/al-recentlyLikeProducts'
  import { GUESS_LIKE_PLP_CONFIG } from '@/constants/cms'

  export default {
    props: {
      keyWord: {
        type: String,
        default: "",
      },
    },
    components: {
      customButton,
      RecentlyLikeProducts
    },
    data() {
      return {
        GUESS_LIKE_PLP_CONFIG
      }
    },
    methods: {
      goBack() {
        uni.navigateBack();
      }
    }
  }
</script>

<style lang="scss" scoped>
  $textColor:#1D1D1D;

  .no-res-font {
    display: block;
    margin: 44upx 0 0 35upx;
    font-size: 24upx;
    color: #616568;
  }

  .no-res-tip {
    font-size: 24upx;
    color: $textColor;
    display: block;
    text-align: center;
    margin: 78upx auto 48upx;
  }

  .no-list {
    margin-top: 100upx;
    text-align: center;
    color: $textColor;
    padding-bottom: calc(100rpx + var(--safe-area-inset-bottom));
  }
</style>
