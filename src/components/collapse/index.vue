<template>

<div class="collapse">
  <view class="collapse-title" :id="`collapse-title-${domId}`" @tap="toggleEventer">
    <view class="text">
      <slot name="title"></slot>
    </view>
  </view>
  <view class="collapse-outer" :class="showStatus ? 'collapse-outer-show' : ''">
    <view class="collapse-inner" :class="showStatus ? 'collapse-inner-show' : ''">
      <slot name="content"></slot>
    </view>
  </view>
</div>
</template>

<script>
export default {
  props: {
    status: {
      type: Boolean,
      value: false,
    },
    scroll: {
      type: Boolean,
      value: true,
    },
    top: {
      type: Number,
      value: 0,
    },
    domId: {
      type: String,
    },
  },
  data() {
    return {
      showStatus: this.status,
    }
  },
  methods: {
    toggleEventer() {
      this.showStatus = !this.showStatus

      this.scrollTop();
    },
    scrollTop() {
      this.$nextTick(() => {
        uni.createSelectorQuery().in(this)
          .select(`#collapse-title-${this.domId}`)
          .boundingClientRect()
          .selectViewport()
          .scrollOffset()
          .exec((res) => {
            console.log(res)
            uni.pageScrollTo({
              scrollTop: res[0].top + res[1].scrollTop - this.top,
            })
          })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
