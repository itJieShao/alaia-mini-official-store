<template>
  <view class="help-center" :style="{'padding-top':ktxStatusHeight}">
    <custom-nav-bar title="帮助中心" :head-border="false" :head-font-color="false"  />
    <view class="help-list">
      <view class="help-list-item" v-for="(item ,index ) in helpList" :key="index" @click="goHelpDetail(item)">
        <text>{{item.value}}</text>
        <text class="icon-font icon-zuoyoujiantou"></text>
      </view>
    </view>
  </view>
</template>

<script>
import { getCmsContent } from '@/service/apis';
import { parseCmsContent } from '@/utils/cms';
import { HELP_LIST_CMS_CONFIG } from '@/constants/cms';

export default {
  name: 'help',
  data() {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      helpList: [],
    }
  },
  created() {
    this.getHelpList()
  },
  // 阻止下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  methods: {
    // 去帮助中心详情页
    goHelpDetail(item) {
      console.log(item);
      uni.navigateTo({
        url: `/subPackages/help/pages/help-detail/index?name=${item.value}&templateCode=${item.templateCode}&contentCode=${item.contentCode}`,
      })
    },
    // 获取帮助中心list
    async getHelpList() {
      const { moduleCode, ...rest } = HELP_LIST_CMS_CONFIG;
      try {
        const res = await getCmsContent({ ...rest });
        const helpList = parseCmsContent(res, rest.templateCode, moduleCode);
        this.helpList = helpList.map((item) => ({ 
          templateCode: item.target_tid, 
          contentCode: item.target_id,
          value: item.title
        }));
      } catch (error) {
        console.error(error)
      }
    },

  },
}
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
