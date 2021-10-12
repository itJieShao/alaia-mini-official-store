<template>
  <view v-if="visible" :class="['service',{ 'aa': border },]">
    <button class="btn disabled">BUTTION客服弹层</button>
    <button class="btn btn-primary">BUTTION客服弹层</button>
    <button class="btn btn-black-white">BUTTION客服弹层</button>
    <button class="btn btn-disabled">BUTTION客服弹层</button>
    <text class="icon-font icon-icon-weixin"></text>客服弹层
  </view>
</template>

<script>

export default {
  name: 'navBar',
  props: {
    visible: { type: Boolean, default: false },
  },
  computed: {
    styles() {
      return `z-index: ${this.zIndex};${
        this.safeAreaInsetTop ? `padding-top: ${this.statusBarHeight}px;` : ''
      }${this.customStyle}`;
    },
  },
  methods: {
    onClickRight() {
      this.$emit('click-right');
    },
  },
};
</script>

<style lang="scss">
.service{
  position: fixed;
  bottom: 100px;
  left: 0;
  width: 100%;
  color: #f00;
  .btn{
  }
}

</style>
