<template name="comTitle">
  <view class="com-title">
    <text class="main-title" v-if="title">{{title}}</text>
    <text class="subtitle" v-if="subtitle">{{subtitle}}</text>
  </view>
</template>
<script>
  export default {
    name: 'comTitle',
    components: {},
    props: {
      title: {
        type: String,
        value: '',
      },
      subtitle: {
        type: String,
        value: '',
      },
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .com-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #1D1D1D;

    .main-title {
      font-size: 48rpx;
      line-height: 66rpx;
      letter-spacing: 4rpx;
      font-weight: bold;
      font-family: PingFangSC;
    }

    .subtitle {
      margin-top: 14rpx;
      font-size: 28rpx;
      line-height: 40rpx;
      letter-spacing: 2rpx;
      font-family: PingFangSC;
    }
  }
</style>
