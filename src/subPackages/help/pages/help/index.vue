<template>
  <view class="help-center" :style="{'padding-top':ktxStatusHeight}">
    <custom-nav-bar :head-border="false" :head-font-color="false"  />
    <view class="help-center-title">帮助中心</view>
    <view class="help-list">
      <view class="help-list-item" v-for="(item ,index ) in helpList" :key="index" @click="goHelpDetail(item)">
        <text>{{item.value}}</text>
        <text class="icon-font icon-icon-youjiantou"></text>
      </view>
    </view>
  </view>
</template>

<script>
import { getHelpList } from '@/service/apis';
import { get } from '@/utils/utilityOperationHelper';

export default {
  name: 'help',
  data() {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      helpList: [
        { name: '养护建议' },
        { name: '售后、保修服务' },
        { name: '常见问题' },
        { name: '服务条款' },
        { name: '隐私政策' },
        { name: '销售条款销售条款' },
      ],
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
        const res = await getHelpList({
          templateCode: 'help_index',
          contentCode: 'help_index',
        });
        const cmsContent = JSON.parse(get(res, 'data.shop.cmsContent', null)) || {};
        const helpList = get(cmsContent, 'content.zh_CN.help_index.modelContents', [])
          .map((v) => ({
            templateCode: v.groupContents.index[0].fieldContents.target_tid,
            contentCode: v.groupContents.index[0].fieldContents.target_id,
            value: v.groupContents.index[0].fieldContents.title,
          }))
        this.helpList = helpList;
        console.log('帮助中心列表', helpList);
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
