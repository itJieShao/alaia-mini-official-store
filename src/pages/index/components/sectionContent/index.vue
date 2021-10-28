<template name="sectionContent">
  <view class="home-section-content" v-if="infoData">
      <view class="title">
        <com-title :title="infoData.title" />
      </view>
      <template v-if="infoData.source_type ==='image'">
        <image class="home-section-content-media" :src="infoData.source_url"  mode="widthFix" :lazy-load="true" />
      </template>
      <template v-if="infoData.source_type ==='video'">
        <video class="home-section-content-media"
        :src="infoData.source_url" :loop="false" :controls="true" object-fit ="cover"
        :show-mute-btn="true" :show-center-play-btn="true"
        :show-play-btn="true" :show-fullscreen-btn="true"
        play-btn-position="center" :enable-progress-gesture="false"></video>
      </template>
      <view class="font-content">
        <text> {{ infoData.sub_title }} </text>
      </view>
      <view class="home-more-btn" v-if="infoData.has_button">
        <customButton :btnWidth="480" :btnHeight="80" className="transparent" @click="() => navigateTo(infoData.link)">{{ infoData.button_txt }}</customButton>
      </view>
  </view>
</template>
<script>

import { mapActions, mapGetters } from 'vuex';
import customButton from '@/components/al-button/normal';
import { parseCmsContent } from '@/utils/cms';
import { OSS_URL } from '@/constants/env';
import { navigateTo } from '@/utils/utils';
import ComTitle from '../comTitle/comTitle';

export default {
  name: 'SectionContent',
  components: {
    ComTitle,
    customButton,
  },
  props: {
      config: {
      type: Object,
      default: () => {},
    }
  },
  computed: {
    ...mapGetters('cms', ['cmsContentMap']),
  },
  data() {
    return {
      infoData: null
    };
  },
  watch: {
    cmsContentMap (newValue) {
      const { moduleCode, ...rest } = this.config;
      try {
        const res = newValue[rest.contentCode];
        const cmsContentData = parseCmsContent(res, rest.templateCode, moduleCode);
        let infoData = cmsContentData.shift();
        if (infoData.source_url && !/^(http|https)/.test(infoData.source_url)) {
          infoData.source_url = `${OSS_URL}${infoData.source_url}`
        }
        this.infoData = infoData;
      } catch (error) {
        console.error(error)
      }
    }
  },
  methods: {
    ...mapActions('cms', ['getCmsContentMapData']),
    navigateTo
  }
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
$color: #1D1D1D;

.home-section-content {
  background-color: #fff;
  .title {
    padding: 118rpx 0 44rpx;
  }
  .home-section-content-media {
    width: 100%;
  }
  .font-content{
    padding: 60rpx 0 52rpx;
    text{
      display: block;
      width: 80%;
      margin: 0 auto;
      letter-spacing: 4rpx;
      font-size: 28rpx;
      line-height: 40rpx;
      color: $color;
      text-align: center;
    }
  }
}
</style>
