<template>
  <view class="help-detail" :style="{'padding-top':ktxStatusHeight}">
    <custom-nav-bar :head-border="false"  :head-font-color="false"  />
    <!-- help title & logo -->
    <view class="help-detail-title">
      <text class="icon-font icon-icon-logo"></text>
      <view class="help-detail-title-name">{{helpTitle}}</view>
    </view>
    <view class="help-detail-content">
      <block v-for="(item,index) in  helpContent" :key="index">
        <!-- type == sub_type 标题 -->
        <view class="sub_type" v-if="item.type === 'sub_type'" :style="{'textAlign':item.textAlignm,'fontWeight':'700'}"> {{item.content}} </view>
        <!-- type == text 文本 -->
        <view v-if="item.type  === 'text'" :style="{'fontWeight':item.fontWeight}">
          <text>{{item.content}}</text>
        </view>
        <!-- type == bullet 带小圆点的text -->
        <view class="cont" v-if="item.type === 'bullet'" :style="{'fontWeight':item.fontWeight}">
          <view>
            <text>{{item.content}}</text>
          </view>
        </view>
        <!-- type == img 图片 -->
        <view class="image" v-if="item.type === 'img'">
          <image :src="item.content" mode="widthFix" :lazy-load="true" />
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { getCmsContent } from '@/service/apis';
import { get } from '@/utils/utilityOperationHelper';

export default {
  name: 'help-detail',
  data() {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight, //
      helpTitle: '', // 标题
      templateCode: '', // templateCode 值
      contentCode: '', // contentCode 值
      helpContent: [], // 页面内容
    }
  },
  onLoad(option) {
    this.helpTitle = option.name;
    this.templateCode = option.templateCode;
    this.contentCode = option.contentCode;
    console.log(this.templateCode, this.contentCode)
    this.getHelpDetail();
  },
  // 阻止下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  methods: {
    async getHelpDetail() {
      try {
        const res = await getCmsContent({
          templateCode: this.templateCode,
          contentCode: this.contentCode,
        });
        const cmsContent = JSON.parse(get(res, 'data.shop.cmsContent', null)) || {};
        this.helpTitle = cmsContent.contentName;
        console.log('cmsContent ===>', cmsContent);
        const helpContent = get(cmsContent, 'content.zh_CN.content.modelContents', [])
          .map((v) => ({ content: v.groupContents.content[0].fieldContents.content, type: v.groupContents.content[0].fieldContents.type, fontWeight: v.groupContents.content[0].fieldContents['special requirements'] == '["bold"]' ? 'bold': ''}))
        console.log('helpContent ===>', helpContent);
        this.helpContent = helpContent;
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
