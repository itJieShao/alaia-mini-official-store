<template>
  <view style="padding-bottom: 100upx;">
    <custom-nav-bar left-icon="search" left-text="搜索" title="分类" :head-border="false" :head-font-color="false" />
    <view :style="{'padding-top':ktxStatusHeight}"></view>
    <view class="content" :style="'height: calc(100vh - '+ktxStatusHeight+' - 112rpx - var(--safe-area-inset-bottom));'">
      <view class="activity-banner">
        <image class="cover" :src="cover" mode="aspectFill"></image>
        <view class="txt">FALL WINTER 2021 COLLECTION</view>
      </view>
      <view class="category-banner">
        <image class="cover" :src="cover" mode="aspectFill"></image>
      </view>
      <view class="category">
        <view class="item" v-for="(item,index) in pageData" :key="item">
          <view class="title" @click="cutItem(index)">{{item.label}}</view>
          <view class="children" v-show="isActive==index">
            <view class="c-item" v-for="li in item.children" :key="li">
              <!-- 点击空白收起部分 -->
              <view class="mark" @click="cutItem(null)"></view>
              <text class="txt">{{li.lable}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      type: 2,
      cover: 'http://scm-dam-oss-cn-cdn.baozun.com/scm-dam/2021-7-22/0.8227653865569999Aurora%E7%B3%BB%E5%88%97-750_442_.jpg',
      pageData: [
        {
          label: '新品上市',
          children: [],
        },
        {
          label: '成衣',
          children: [
            { lable: '连衣裙' },
            { lable: '半裙' },
            { lable: '连紧身衣和紧身裤' },
            { lable: '裤装' },
            { lable: '上衣和衬衫' },
            { lable: '外套和夹克' },
          ],
        },
        {
          label: '成衣1',
          children: [
            { lable: '连衣裙1' },
            { lable: '半裙1' },
            { lable: '连紧身衣和紧身裤1' },
            { lable: '裤装1' },
            { lable: '上衣和衬衫1' },
            { lable: '外套和夹克1' },
          ],
        },
        {
          label: '成衣2',
          children: [
            { lable: '连衣裙2' },
            { lable: '半裙2' },
            { lable: '连紧身衣和紧身裤2' },
            { lable: '裤装2' },
            { lable: '上衣和衬衫2' },
            { lable: '外套和夹克2' },
          ],
        },
        {
          label: '成衣3',
          children: [
            { lable: '连衣裙3' },
            { lable: '半裙3' },
            { lable: '连紧身衣和紧身裤3' },
            { lable: '裤装3' },
            { lable: '上衣和衬衫3' },
            { lable: '外套和夹克3' },
          ],
        },
        {
          label: '成衣4',
          children: [
            { lable: '连衣裙4' },
            { lable: '半裙4' },
            { lable: '连紧身衣和紧身裤4' },
            { lable: '裤装4' },
            { lable: '上衣和衬衫4' },
            { lable: '外套和夹克4' },
          ],
        },
        {
          label: '成衣5',
          children: [
            { lable: '连衣裙5' },
            { lable: '半裙5' },
            { lable: '连紧身衣和紧身裤5' },
            { lable: '裤装5' },
            { lable: '上衣和衬衫5' },
            { lable: '外套和夹克5' },
          ],
        },
      ],
      isActive: null,
    }
  },
  onLoad () {

  },
  onPullDownRefresh () {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  onShareAppMessage (res) {
    return {
      title: 'TASAKI塔思琦线上旗舰店',
      path: '/pages/category/index',
    }
  },
  methods: {
    cutItem (index) {
      this.isActive = index
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
$fontColor: #1d1d1d;
.content {
  position: relative;
  overflow-y: auto;
  padding-top: rpx(3);
}
.activity-banner {
  position: relative;
  z-index: 1;
  width: 100%;
  height: rpx(175);
  margin-bottom: rpx(10);
  .cover {
    width: 100%;
    height: 100%;
  }
  .txt {
    font-family: Lato, Lato-Bold;
    font-size: rpx(16);
    font-weight: 700;
    line-height: rpx(19);
    position: absolute;
    z-index: 2;
    bottom: rpx(17);
    left: 0;
    width: 100%;
    padding: 0 rpx(12);
    text-align: center;
    letter-spacing: 2px;
    color: #fff;
  }
}
.category-banner {
  width: 100%;
  height: rpx(175);
  .cover {
    width: 100%;
    height: 100%;
  }
}
.category {
  padding-top: rpx(10);
  background-color: #fff;
  .item {
    width: 100%;
    .title {
      font-family: PingFangSC, PingFangSC-Medium;
      font-size: rpx(16);
      font-weight: 500;
      line-height: rpx(22);
      padding: rpx(10);
      text-align: center;
      letter-spacing: 1px;
      color: #1d1d1d;
    }
    .children {
      background: #f7f7f7;
      .c-item {
        position: relative;
        padding: rpx(11) rpx(10);
        text-align: center;
        &:first-child {
          padding-top: rpx(15);
        }
        .mark {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .txt {
          font-family: PingFangSC, PingFangSC-Regular;
          font-size: rpx(13);
          font-weight: 400;
          line-height: rpx(18);
          position: relative;
          color: #616161;
        }
      }
    }
  }
}

</style>
