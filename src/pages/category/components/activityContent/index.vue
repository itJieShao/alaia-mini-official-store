<template name="activity-content">
  <swiper class="swiper category-activity-content" v-if="infoDataList.length > 0">
        <swiper-item v-bind:key="index" class="scroll-view" v-for="(infoData, index) in infoDataList">
            <view class="category-activity-item" v-if="infoData">
                <template v-if="infoData.source_type ==='image'">
                    <image @click="() => navigateTo(infoData.link)" class="content-media" :src="infoData.source_url"  mode="widthFix" :lazy-load="true" />
                </template>
                <template v-if="infoData.source_type ==='video'">
                    <video class="content-media"
                    @click="() => navigateTo(infoData.link)"
                    :src="infoData.source_url" :loop="false" :controls="true" object-fit ="cover"  
                    :show-mute-btn="true" :show-center-play-btn="true" 
                    :show-play-btn="true" :show-fullscreen-btn="true" 
                    play-btn-position="center" :enable-progress-gesture="false"></video>
                </template>
                <view>{{ infoData.title }}</view>
            </view>
        </swiper-item>
  </swiper>
</template>
<script>
import { getCmsContent } from '@/service/apis';
import { parseCmsContent } from '@/utils/cms';
import { OSS_URL } from '@/constants/env';
import { navigateTo } from '@/utils/utils';

export default {
  name: 'ActivityContent',
  props: {
      config: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      infoDataList: []
    };
  },
  mounted () {
    this.getInfoListData();
  },
  methods: {
    navigateTo,
    async getInfoListData() {
      const { moduleCode, ...rest } = this.config;
      try {
        const res = await getCmsContent({ ...rest });
        const cmsContentData = parseCmsContent(res, moduleCode, moduleCode);
        this.infoDataList = cmsContentData.map(info => {
            const { source_url } = info;
            if (source_url && !/^(http|https)/.test(source_url)) { 
                info.source_url = `${OSS_URL}${source_url}`                  
            }
            return info;
        });
      } catch (error) {
        console.error(error)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
    @import "./index";
</style>
