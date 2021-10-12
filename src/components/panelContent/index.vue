<template>
  <view v-show="show" class="panel-content">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'PanelContent',
  props: {
    show: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
// .panel-content{
// }
</style>
