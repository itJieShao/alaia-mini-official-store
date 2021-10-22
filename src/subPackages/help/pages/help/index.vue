<template>
  <view class="help-center" :style="{'padding-top':ktxStatusHeight}">
    <custom-nav-bar title="帮助中心" :head-border="false" :head-font-color="false"  />
    <view class="help-list">
      <view class="help-list-item" v-for="(item ,index ) in helpList" :key="index" @click="goHelpDetail(item)">
        <text>{{item.value}}</text>
        <text class="icon-font icon-youjiantou"></text>
      </view>
    </view>
  </view>
</template>

<script>
import { getCmsContent } from '@/service/apis';
import { get } from '@/utils/utilityOperationHelper';
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
      try {
        const res = await getCmsContent({ ...HELP_LIST_CMS_CONFIG });
        const cmsContent = JSON.parse(get(res, 'data.shop.templateData', null)) || {};
        const helpList = get(cmsContent, 'content.zh_CN.help_index.modelContents', [])
          .map((v) => ({
            templateCode: v.groupContents.index[0].fieldContents.target_tid,
            contentCode: v.groupContents.index[0].fieldContents.target_id,
            value: v.groupContents.index[0].fieldContents.title,
          }))
        this.helpList = helpList;
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
