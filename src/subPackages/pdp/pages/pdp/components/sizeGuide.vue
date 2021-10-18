<template>
  <div class="size-guide-container" v-if="sizeGuideShow" :style="{ 'padding-top': computedHeight }" @touchmove.stop="nothing">
    <div class="size-guide-content">
      <div class="icon-font icon-guanbi close" @tap.native.stop="clickClose"></div>
      <div class="title">尺寸指南</div>
      <div class="sub-title">请参考下方尺寸指南找到合适您的尺码</div>
      <div class="details">
        <image mode="widthFix" :lazy-load="true" src="https://res-tasaki.baozun.com/static/images/size-1.png"></image>
      </div>
    </div>
  </div>
</template>

<script>
import navBarHeight from '@/components/common/navBarHeight';

export default {
  name: 'sizeGuide',
  mixins: [navBarHeight],
  props: {
    sizeGuideShow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {
    nothing () {
      return false;
    },
    clickClose () {
      this.$emit('clickClose');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.size-guide-container {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  .size-guide-content {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    border-top: rpx(1) solid #f4f4f4;
    .close {
      font-size: rpx(18);
      position: absolute;
      top: rpx(3);
      right: 0;
      width: rpx(38);
      height: rpx(38);
      padding: rpx(10);
      color: #8e8e8e;
    }
    .title {
      font-size: rpx(18);
      line-height: rpx(20);
      padding: rpx(33) 0 0;
      color: #1d1d1d;
    }
    .sub-title {
      font-size: rpx(14);
      line-height: rpx(16);
      margin: rpx(66) 0 rpx(32);
      color: #bbb;
    }
    .details {
      image {
        width: 100%;
      }
    }
  }
}

</style>
