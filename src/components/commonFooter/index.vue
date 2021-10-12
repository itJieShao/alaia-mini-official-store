<template>
  <div class="footer-content">
      <div :class="['footer-title', className]">线上精品店服务</div>
      <div class="footer-item-content">
        <div class="footer-item border-bottom">
          <!-- <image class="delivery" :src="require('../../assets/images/icon/delivery.svg')"></image> -->
          <view class="text">臻品免邮配送</view>
          <view class="tips">免邮配送和7日内退货服务</view>
        </div>
        <div class="footer-item border-bottom">
          <!-- <image class="free" :src="require('../../assets/images/icon/Samples.svg')"></image> -->
          <view class="text">精选试用礼遇</view>
          <view class="tips">臻选体验装礼遇</view>
        </div>
        <div class="footer-item">
          <!-- <image class="package" :src="require('../../assets/images/icon/white-gloves-1.svg')"></image> -->
          <view class="text">专使递送</view>
          <view class="tips">专使尊贵递送服务*</view>
        </div>
        <div class="footer-item">
          <!-- <image class="safe" :src="require('../../assets/images/icon/Secret-Code.png')"></image> -->
          <view class="text">密令签收</view>
          <view class="tips">凭专属密令签收保障订单安全*</view>
        </div>
      </div>
      <div class="footer-tips">
        <div>*每笔订单满10,000元尊享密令签收服务</div>
        <div>*每笔订单满10,000元或购买鱼子精华琼贵紧颜液即可尊享莱珀妮专使尊贵递送服务，仅限上海地区，详询在线客服</div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'CommonFooter',
  props: {
    // big-title
    className: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
