<template>
  <view class="help-detail" :style="{'padding-top':ktxStatusHeight}">
    <custom-nav-bar title="帮助中心"  />
    <view class="help-detail-title">
      <view class="help-detail-title-name">{{helpTitle}}
        <text class="icon icon-font icon-icon-tuxingxingzhuang"></text>
      </view>
    </view>
    <view class="help-detail-content">
      <view :key="i" v-for="helpContent, i in helpContentList">
        <view class="title">{{ helpContent.title }}</view>
        <view class="content">{{ helpContent.content }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getCmsContent } from '@/service/apis';
import { parseCmsContent  } from '@/utils/cms';
import { HELP_DETAIL_CMS_CONFIG } from '@/constants/cms';
import { get } from '@/utils/utilityOperationHelper';

export default {
  name: 'help-detail',
  data() {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight, //
      helpTitle: '', // 标题
      templateCode: '', // templateCode 值
      contentCode: '', // contentCode 值
      helpContentList: [], // 页面内容
    }
  },
  onLoad(option) {
    this.helpTitle = option.name;
    this.templateCode = option.templateCode;
    this.contentCode = option.contentCode;
    this.getHelpDetail();
  },
  // 阻止下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  methods: {
    async getHelpDetail() {
      try {
        const { fieldName, moduleCode } = HELP_DETAIL_CMS_CONFIG;
        const res = await getCmsContent({ templateCode: this.templateCode, contentCode: this.contentCode });
        const resData = get(res, 'data.shop.templateData');
        this.helpContentList = parseCmsContent(resData, fieldName, moduleCode);
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  @import './index';
</style>
