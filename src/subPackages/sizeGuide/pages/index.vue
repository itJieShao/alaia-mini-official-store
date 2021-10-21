<template>
  <view>
    <custom-nav-bar :left-arrow="isLeftArrow" title="尺码指南" :head-border="false" :head-font-color="false" />
    <view class="content" :style="{ 'padding-top':ktxStatusHeight }">
      <view class="size-guide">
        <view class="txt">此换算表中为估计值，可以帮助您找到合适的尺码。</view>
        <view class="txt">如果您已经购买了我们品牌的商品，建议您继续选择产品标签上所示的尺码。</view>
        <div class="details">
          <image mode="widthFix" :lazy-load="true" src="https://res-tasaki.baozun.com/static/images/size-1.png"></image>
        </div>
        <view class="txt">联系我们</view>
        <view class="txt tip">中国时间，周一至周五，早9点至晚11点</view>
        <view class="txt icon-tips"><text class="icon-font icon-phone_000-1"></text><text class="icon">1-855-463-509</text></view>
        <view class="txt icon-tips"><text class="icon-font icon-mail_000"></text><text class="icon">发电子邮件</text></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      isLeftArrow: true,
    }
  },
  computed: {},
  onLoad () { },
  onShow () { },
  onPullDownRefresh () {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  onShareAppMessage (res) {
    return {
      title: 'TASAKI塔思琦线上旗舰店',
      path: '/subPackages/sizeGuide/pages/index',
    }
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.size-guide {
  padding: rpx(30) rpx(16);
  .txt {
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: rpx(14);
    font-weight: 400;
    line-height: rpx(20);
    margin-bottom: rpx(16);
    text-align: left;
    color: #272727;
  }
  .icon-tips {
    margin-bottom: rpx(9);
  }
  .tip {
    color: #727272;
  }
  .icon {
    text-decoration: underline;
  }
  .icon-font {
    margin-right: rpx(9);
    color: #000;
  }
}

</style>
