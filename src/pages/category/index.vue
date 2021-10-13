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
          <view class="title" @click="cutItem(index)">{{item.name}}</view>
          <view class="children" v-show="curIndex==index">
            <view class="c-item" v-for="li in item.children" :key="li">
              <!-- 点击空白收起部分 -->
              <view class="mark" @click="cutItem(null)"></view>
              <text class="txt" @click="goPlp(li.name,li.url,li.icon)">{{li.name}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { priceFormat, imgUrlReplace } from '@/utils/utils';

export default {
  data () {
    return {
      type: 2,
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      pageData: [],
      curIndex: null,
    }
  },
  computed: {
    ...mapGetters('category', ['categoryData']),
  },
  filters: {
    formatMoney (val) {
      if (val) {
        return priceFormat(val);
      }
      return '0';
    },
  },
  async onLoad () {
    const res = await this.getCategoryData();
    for (const [key, value] of Object.entries(res)) {
      if (value.name === '商品分类') {
        this.pageData = value ? value.children : []
      }
    }
  },
  onShow () {
    this.setTabSelected(1);
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
    imgUrlReplace,
    ...mapMutations('globle', ['setTabSelected']),
    ...mapActions('category', ['getCategoryData', 'categoryProductList']),

    cutItem (index) {
      this.curIndex = index
    },
    getProduct () {
      uni.showLoading({
        title: '加载中...',
      });
      const allSpuCodes = [];
      this.pageData[1].children.forEach((item) => {
        if (item.children) {
          item.children.forEach((it) => {
            it.children && allSpuCodes.push(...it.children[0].spuCodes)
          })
        }
      })
      this.categoryProductList(allSpuCodes).then((list) => {
        const newList = list.length && list.filter((s) => s != null && s != undefined && s != '');
        this.pageData[1].children.forEach((item) => {
          if (item.children) {
            item.children.forEach((it) => {
              if (it.children) {
                it.goodsChildren = [];
                it.children[0].spuCodes.forEach((itd) => {
                  const pushItem = newList.find((itdc) => itdc.code == itd && itdc.onShelves);
                  if (pushItem) {
                    it.goodsChildren.push(pushItem)
                  }
                })
              }
            })
          }
        })
        this.rightData = this.pageData[1].children[0];
        uni.hideLoading();
      })
    },
    observer () {
      setTimeout(() => {
        if (this._observer) {
          this._observer.disconnect();
        }
        this._observer = wx.createIntersectionObserver(this, {
          observeAll: true,
        })
        this._observer.relativeToViewport({
          bottom: 0,
        })
          .observe('.observer_item', (res) => {
            const {
              dataset,
            } = res;
            const aData = {
              sku: {
                sku_id: dataset.skucode, // 若商品无sku_id时，可传spu_id信息
                sku_name: dataset.title, // 若商品无sku_name时，可传spu_name信息
              },
              spu: {
                spu_id: dataset.spucode, // 若商品无spu_id时，可传sku_id信息
                spu_name: dataset.title, // 若商品无spu_name时，可传sku_name信息
              },
              sale: {
                original_price: dataset.price, // 对接智慧零售入口必传
                current_price: dataset.price, // 对接智慧零售入口必传
              },
              primary_image_url: dataset.image,
            }
            this.$sr.track('expose_sku_component', aData)
          })
      }, 200)
    },
    goPlp (name, url, img, remark) {
      if (url) {
        if (remark) {
          uni.navigateTo({
            url: `/subPackages/plp/pages/plp/index?name=${name}&code=${url}&img=${img}&remark=${remark}`,
          })
        } else {
          uni.navigateTo({
            url: `/subPackages/plp/pages/plp/index?name=${name}&code=${url}&img=${img}`,
          })
        }
      }
    },
    goPdp (item) {
      const aData = {
        sku: {
          sku_id: item.skus && item.skus.length && item.skus[0].code ? item.skus[0].code
            : item.code, // 若商品无sku_id时，可传spu_id信息
          sku_name: item.title || 'TASAKI', // 若商品无sku_name时，可传spu_name信息
        },
        spu: {
          spu_id: item.code || 'TASAKI', // 若商品无spu_id时，可传sku_id信息
          spu_name: item.title || 'TASAKI', // 若商品无spu_name时，可传sku_name信息
        },
        sale: {
          original_price: item.skus && item.skus.length && item.skus[0].salePrice.amount ? item.skus[0].salePrice
            .amount : 0, // 对接智慧零售入口必传
          current_price: item.skus && item.skus.length && item.skus[0].salePrice.amount ? item.skus[0].salePrice
            .amount : 0, // 对接智慧零售入口必传
        },
        primary_image_url: '',
      }
      if (item.images.length && item.images[0].url) {
        aData.primary_image_url = item.images[0].url;
      }
      this.$sr.track('trigger_sku_component', aData)
      uni.navigateTo({
        url: `/subPackages/pdp/pages/pdp/index?code=${item.code}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
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
