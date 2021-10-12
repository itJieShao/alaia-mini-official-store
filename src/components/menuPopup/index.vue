<template>
  <view class="left-pop-up" @touchmove.stop.prevent="handleMove">
    <view :class="['wrapper', {'show': show, 'animation': isAnimation}]">
      <view class="layer" @click="handleClose"></view>
      <view class="content">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'PopUp',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 点击关闭时添加动画
      isAnimation: false,
    }
  },
  watch: {
    show(newVal) {
      newVal && (this.isAnimation = true)
    },
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleMove() {
      return false
    },
  },
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
