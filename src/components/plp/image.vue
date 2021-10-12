<template>
  <view v-if="viewData && viewData.pic" class="wrapper">
    <image mode="widthFix" :src="$photoCompress(viewData.pic)"/>
  </view>
</template>

<script>
import { formatViewData } from '../../utils/cms'
import { get } from '../../utils/utilityOperationHelper'

export default {
  props: {
    promotion: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    viewData() {
      return formatViewData(get(this.promotion, 'value'), {})
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  text-align: center;
  image {
    margin: auto;
    width: 680rpx;
  }
}
</style>
