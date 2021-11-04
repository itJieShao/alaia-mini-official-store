<template>
  <view>
    <custom-nav-bar :left-arrow="isLeftArrow" title="尺码指南" :head-border="false" :head-font-color="false" />
    <view class="content" :style="{ 'padding-top':ktxStatusHeight }">
      <view class="size-guide">
        <view class="module-l1">
          <view class="txt">{{ProductDetails.title}}</view>
          <view class="txt">￥{{ProductDetails.salePrice.amount}}</view>
          <div class="details">
            <image mode="widthFix" :lazy-load="true" :src="ProductDetails.cover[0]"></image>
          </div>
          <block v-for="li in ProductDetails.extAttribute" :key="li.code">
            <view class="txt tip" v-if="li.code=='sizeguideOption'">{{li.value}}</view>
          </block>
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
            <block v-for="(item,index) in ProductDetails.bodyMeasurements" :key="index">
              <block v-if="item.unit==company">
                <block v-for="(li,idx) in item.mapAttrs" :key="idx">
                  <view :class="['txt',active==idx?'active':'']" @click="active=idx">{{li.attr}}</view>
                </block>
              </block>
            </block>
          </view>
          <view class="title">选择单位</view>
          <view class="company-list">
            <view :class="['txt',company=='ft'?'active':'']" @click="company='ft'">英寸</view>
            <view :class="['txt',company=='cm'?'active':'']" @click="company='cm'">厘米</view>
          </view>
          <div class="size gap-top">
            <view class="box box1">
              <block v-for="(item,index) in ProductDetails.bodyMeasurements" :key="index">
                <block v-if="item.unit==company">
                  <block v-for="(li,idx) in item.mapAttrs" :key="idx">
                    <block v-if="active==idx">
                      <block v-for="(i,dx) in li.size" :key="dx">
                        <view class="f" v-if="i.key=='F'">{{i.key}}.{{i.value}}</view>
                        <view class="b" v-if="i.key=='B'">{{i.key}}.{{i.value}}</view>
                        <view class="g" v-if="i.key=='G'">{{i.key}}.{{i.value}}</view>
                        <view class="c" v-if="i.key=='C'">{{i.key}}.{{i.value}}</view>
                        <view class="d" v-if="i.key=='D'">{{i.key}}.{{i.value}}</view>
                      </block>
                    </block>
                  </block>
                </block>
              </block>
            </view>
            <view class="box box2">
              <block v-for="(item,index) in ProductDetails.bodyMeasurements" :key="index">
                <block v-if="item.unit==company">
                  <block v-for="(li,idx) in item.mapAttrs" :key="idx">
                    <block v-if="active==idx">
                      <block v-for="(i,dx) in li.size" :key="dx">
                        <view class="a" v-if="i.key=='A'">{{i.key}}.{{i.value}}</view>
                        <view class="e" v-if="i.key=='E'">{{i.key}}.{{i.value}}</view>
                        <view class="i" v-if="i.key=='I'">{{i.key}}.{{i.value}}</view>
                        <view class="h" v-if="i.key=='H'">{{i.key}}.{{i.value}}</view>
                      </block>
                    </block>
                  </block>
                </block>
              </block>
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
import { getProductDetailsAction } from '@/service/apis/pdp';

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
      company: 'ft',
      code: null,
      ProductDetails: {},
    }
  },
  computed: {},
  onLoad (options) {
    const { code } = options;
    this.code = code
    this.getProductDetails(code)
  },
  onShow () { },
  onPullDownRefresh () {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  methods: {
    async getProductDetails (code) {
      const result = await getProductDetailsAction({
        codes: [code],
      });
      const { productByCode } = result.data.shop
      const ProductDetails = productByCode.length ? productByCode[0] : {}
      for (const [key, value] of Object.entries(ProductDetails)) {
        if (key == 'images') {
          const covers = []
          value.forEach((e) => {
            if (e.type == 'MAINIMAGE') {
              covers.push(e.url)
            }
          });
          ProductDetails.cover = covers
        }
        if (key == 'bodyMeasurements') {
          value.forEach((element) => {
            element.mapAttrs.forEach((e) => {
              const newSize = []
              const size = e.relationAttr.split('&')
              size.forEach((element) => {
                const a = element.split(':')
                newSize.push({
                  key: a[0],
                  value: a[1],
                })
              });
              e.size = newSize
            });
          });
        }
      }
      this.ProductDetails = ProductDetails
    },
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
