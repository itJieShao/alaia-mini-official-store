<template name="comTitle">
  <view class="com-title" v-if="title">
    <view class="com-series-title">
      <!-- <text class="icon-font icon-icon-logo"></text> -->
      <text>{{title}}</text>
    </view>
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
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
.com-title{
  // 系列标题
  .com-series-title {
    width: calc(100vw);
    height: 120rpx;
    line-height: 120rpx;
    text-align: center;
    background-color: $mainColor;
    font-size: 32rpx;
    .icon-font{
      margin-right: 36rpx;
    }
  }
}

</style>
