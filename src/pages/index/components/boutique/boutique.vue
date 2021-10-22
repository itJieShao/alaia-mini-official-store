<template name="boutique">
  <view class="boutique">
      <view class="title">
        <com-title :title="storeInfo.title" />
      </view>
      <image v-if="storeInfo.source_type ==='image'" class="boutique-img" :src="storeInfo.source_url"  mode="widthFix" :lazy-load="true" />
      <view class="font-content">
        <text> {{ storeInfo.sub_title }} </text>
      </view>
      <view class="home-more-btn" v-if="storeInfo.has_button">
        <customButton :btnWidth="280" :btnHeight="80" className="transparent" @click="goStoreList">{{ storeInfo.button_txt }}</customButton>
      </view>
  </view>
</template>
<script>
import customButton from '@/components/al-button/normal';
import { getCmsContent } from '@/service/apis';
import { parseCmsContent } from '@/utils/cms';
import { OSS_URL } from '@/constants/env';
import { HOME_STORE_CONFIG } from '@/constants/cms';
import ComTitle from '../comTitle/comTitle';
import { get } from '@/utils/utilityOperationHelper';

export default {
  name: 'boutique',
  components: {
    ComTitle,
    customButton,
  },
  data() {
    return {
      storeInfo: {}
    };
  },
  mounted () {
    this.getStoreData();
  },
  methods: {
    goStoreList() {
      uni.navigateTo({ url: this.storeInfo.link })
    },
    async getStoreData() {
      const { moduleCode, ...rest } = HOME_STORE_CONFIG;
      try {
        const res = await getCmsContent({ ...rest });
        const cmsContentData = parseCmsContent(res, rest.templateCode, moduleCode);
        let storeInfo = cmsContentData.shift();
        if (storeInfo.source_url) { storeInfo.source_url = `${OSS_URL}${storeInfo.source_url}`  }
        this.storeInfo = storeInfo;
      } catch (error) {
        console.error(error)
      }
  },
  },
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
$color: #1D1D1D;
// 精品店
.boutique {
  background-color: #fff;
  padding-bottom: 110rpx;
  .title {
    padding: 118rpx 0 44rpx;
  }
  .boutique-img {
    width: 100%;
  }
  .font-content{
    padding: 60rpx 0 52rpx;
    text{
      display: block;
      font-size: 28rpx;
      line-height: 34rpx;
      color: $color;
      text-align: center;
    }
  }
}
</style>
