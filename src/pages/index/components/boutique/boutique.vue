<template name="boutique">
  <view class="boutique">
      <com-title title="精品店"></com-title>
      <image  class="boutique-img" :src="'https://res-tasaki.baozun.com/static/images/boutique-750-996.jpg'"  mode="widthFix" :lazy-load="true" />
      <customButton :btnWidth="280" :btnHeight="80" className="transparent" @click="goStoreList">附近精品店</customButton>
  </view>
</template>
<script>
import customButton from '@/components/button/normal.vue';
import ComTitle from '../comTitle/comTitle';

export default {
  name: 'boutique',
  components: {
    ComTitle,
    customButton,
  },
  props: {

  },
  data() {
    return {};
  },
  methods: {
    goStoreList() {
      uni.navigateTo({
        url: '/subPackages/store-list/pages/store-list/index',
      })
    },
  },
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
// 精品店
.boutique {
  .boutique-img {
    width: 100%;
    margin-bottom: 80rpx;
  }

}
</style>
