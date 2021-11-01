<template>
  <view class="help-detail" :style="{'padding-top':ktxStatusHeight}">
    <custom-nav-bar title="帮助中心"  />
    <view class="help-detail-title">
      <view class="help-detail-title-name">{{helpTitle}}
        <text class="icon icon-font icon-icon-tuxingxingzhuang"></text>
      </view>
    </view>
    <view class="help-detail-content">
      <view>
        <view class="title">关于正品</view>
        <view class="content">我们向您保证ALAÏA精品店所售商品均为原装正品。</view>
      <view>
        <view>
        <view class="title">关于签收</view>
        <view class="content">ALAÏA唯一指定官方配送渠道为顺丰速递，我们将确保商品安全送至您的手中，并将为您的订单提供保险，以预防配送期间可能出现的丢失和意外损伤。 一旦您的商品送至指定地址并被本人签收，所购商品将不再受保险保护，如包裹送达时您无法收取，您可以提前联系在线顾问，我们将协助您解决。</view>
      <view>
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
      // try {
      //   const res = await getCmsContent({
      //     templateCode: this.templateCode,
      //     contentCode: this.contentCode,
      //   });
      //   const cmsContent = JSON.parse(get(res, 'data.shop.cmsContent', null)) || {};
      //   this.helpTitle = cmsContent.contentName;
      //   console.log('cmsContent ===>', cmsContent);
      //   const helpContent = get(cmsContent, 'zh_CN.content.modelContents', [])
      //     .map((v) => ({ content: v.groupContents.content[0].fieldContents.content, type: v.groupContents.content[0].fieldContents.type, fontWeight: v.groupContents.content[0].fieldContents['special requirements'] == '["bold"]' ? 'bold': ''}))
      //   console.log('helpContent ===>', helpContent);
      //   this.helpContent = helpContent;
      // } catch (error) {
      //   console.error(error)
      // }
    },
  },
}
</script>
<style lang="scss" scoped>
  @import './index';
</style>
