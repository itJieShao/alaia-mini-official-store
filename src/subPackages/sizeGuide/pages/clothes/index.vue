<template>
  <view>
    <custom-nav-bar :left-arrow="isLeftArrow" title="尺码指南" :head-border="false" :head-font-color="false" />
    <view class="content" :style="{ 'padding-top':ktxStatusHeight }">
      <view class="size-guide">
        <view class="module-l1">
          <view class="txt">拉链罗纹针织毛衣</view>
          <view class="txt">￥27,302</view>
          <div class="details">
            <image mode="widthFix" :lazy-load="true" src="https://res-tasaki.baozun.com/static/images/size-1.png"></image>
          </div>
          <view class="txt tip">模特身高178厘米，身着36码样衣</view>
        </view>

        <view class="module-l2 gap-top">
          <view class="txt">尺码表</view>
          <div class="details gap-top">
            <image mode="widthFix" :lazy-load="true" src="https://scm-dam.oss-cn-shanghai.aliyuncs.com/scm-dam/2021-10-27/0.6595602497161128size-03.jpg"></image>
          </div>
          <view class="txt tip">此换算表中为估计值，可以帮助您找到合适的尺码。</view>
          <view class="txt tip">如果您已经购买了我们品牌的商品，建议您继续选择产品标签上所示的尺码。</view>
          <view class="txt gap-top">量身</view>
          <view class="txt tip">我们的产品均按照每个尺码所列的测量值进行剪裁。</view>
        </view>

        <view class="module-l3 gap-top">
          <view class="title">选择尺码</view>
          <view class="size-list">
            <block v-for="(li,index) in sizeList" :key="index">
              <view :class="['txt',active==index?'active':'']" @click="active=index">{{li.label}}</view>
            </block>
          </view>
          <view class="title">选择单位</view>
          <view class="company-list">
            <view :class="['txt',company=='inch'?'active':'']" @click="company='inch'">英寸</view>
            <view :class="['txt',company=='cm'?'active':'']" @click="company='cm'">厘米</view>
          </view>
          <div class="size gap-top">
            <view class="box box1">
              <view class="f">F.170</view>
              <view class="b">B.80</view>
              <view class="g">G.170</view>
              <view class="c">C.170</view>
              <view class="d">D.170</view>
            </view>
            <view class="box box2">
              <view class="a">A.170</view>
              <view class="e">E.170</view>
              <view class="i">I.170</view>
              <view class="h">H.170</view>
            </view>
            <image mode="widthFix" :lazy-load="true" src="https://scm-dam.oss-cn-shanghai.aliyuncs.com/scm-dam/2021-10-27/0.9895252805302546size-01.jpg"></image>
          </div>
        </view>

        <view class="tips-box">
          <view class="txt">下方所列是我们使用的主要测量依据。为帮助您选择最合适的尺码，建议您将每一项数值与您自己的情况进行比较。</view>
          <view class="txt">A. 身高 — 净身高</view>
          <view class="txt">B. 胸围 — 最大胸围。</view>
          <view class="txt">C. 腰围 — 腰部最窄处的腰围。</view>
          <view class="txt">D. 臀围 — 臀部最宽处的臀围。</view>
          <view class="txt">E. 胸高 — 正面测量从领口到腰的长度</view>
          <view class="txt">F. 前肩宽 — 在胸围最大处的腋窝下方从正面测量。</view>
          <view class="txt">G. 上臂 — 上臂的周长，二头肌的最宽处。</view>
          <view class="txt">H. 臂长 — 从肩膀到袖口</view>
          <view class="txt">I. 外长 — 直立时从腰部到地面的腿长。</view>
        </view>

        <view class="gap-top">
          <view class="txt">联系我们</view>
          <view class="txt tip">中国时间，周一至周五，早9点至晚11点</view>
          <view class="txt icon-tips"><text class="icon-font icon-phone_000-1"></text><text class="icon">1-855-463-509</text></view>
          <view class="txt icon-tips"><text class="icon-font icon-mail_000"></text><text class="icon">发电子邮件</text></view>
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
      isLeftArrow: true,
      sizeList: [
        {
          label: '36',
        },
        {
          label: '38',
        },
        {
          label: '42',
        },
        {
          label: '44',
        },
        {
          label: '46',
        },
      ],
      active: 1,
      company: 'inch',
    }
  },
  computed: {},
  onLoad () { },
  onShow () { },
  onPullDownRefresh () {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.size-guide {
  font-size: 0;
  padding: rpx(30) rpx(16);
  .txt {
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: rpx(14);
    font-weight: 400;
    line-height: rpx(20);
    margin-bottom: rpx(16);
    text-align: left;
    color: #272727;
  }
  image {
    width: 100%;
  }
  .icon-tips {
    margin-bottom: rpx(9);
  }
  .tip {
    color: #727272;
  }
  .icon {
    text-decoration: underline;
  }
  .icon-font {
    margin-right: rpx(9);
    color: #000;
  }
  .module-l1 {
    .txt {
      margin-bottom: rpx(6);
    }
    .details {
      margin-top: rpx(16);
      margin-bottom: rpx(16);
    }
  }
  .module-l2 {
    .details {
      margin-bottom: rpx(16);
    }
  }
  .module-l3 {
    .size-list {
      display: flex;
      align-items: center;
      flex-direction: row;
      margin-top: rpx(16);
      margin-bottom: rpx(32);
    }
    .company-list {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      margin-top: rpx(16);

      gap: rpx(25);
      .txt {
        margin-bottom: 0;
      }
    }
    .txt {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      width: rpx(40);
      height: rpx(40);
    }
    .active {
      border-bottom: rpx(1) solid #272727;
    }
    .title {
      font-size: rpx(12);
      font-weight: 400;
      line-height: rpx(17);
      text-align: left;
      letter-spacing: 1px;
      color: #272727;
    }
    .size {
      position: relative;
      margin-top: rpx(30);
      padding: 0 rpx(48);
      text-align: center;
      image {
        width: rpx(220);
        margin-left: rpx(41);
      }
      .box {
        position: absolute;
        view {
          font-size: rpx(12);
          font-weight: 400;
          line-height: rpx(17);
          text-align: left;
          letter-spacing: 1px;
          color: #272727;
        }
      }
      .box1 {
        top: rpx(115);
        left: rpx(40);
        .c {
          margin-top: rpx(20);
        }
        .d {
          margin-top: rpx(32.5);
        }
      }
      .box2 {
        top: 100%;
        right: rpx(22);
        margin-top: rpx(16);
        view {
          display: inline-block;
        }
        .a {
          margin-right: rpx(54);
        }
        .e {
          margin-right: rpx(50);
        }
        .i {
          margin-right: rpx(10);
        }
      }
    }
  }
  .tips-box {
    margin-top: rpx(64);
  }
  .gap-top {
    margin-top: rpx(32);
  }
}

</style>
