<template>
  <view class="wrapper">
    <!-- <view class="left"></view> -->
    <view class="right">国家药监局提示您：化妆品不能宣称医疗作用，也没有治疗作用，宣称治疗儿童湿疹等皮肤病的产品不属于化妆品。</view>
  </view>
</template>

<script>
export default {
  name: 'SafeTips',
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  font-size: 20rpx;
  color: #b5b5b5;
  padding-top: 26rpx;
  padding-bottom: 26rpx;
  .left {
    text-align: center;
    word-break: keep-all;
  }
  .right {
    text-align: center;
  }
}
</style>
