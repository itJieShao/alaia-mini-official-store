<template>
  <view style="padding-bottom: 100upx;">
    <custom-nav-bar left-icon="search" left-text="搜索" :head-border="false" :head-font-color="false" />
    <view :style="{'padding-top':ktxStatusHeight}"></view>
    <view class="content" :style="'height: calc(100vh - '+ktxStatusHeight+' - 112rpx - var(--safe-area-inset-bottom));'">
      <scroll-view scroll-y class="scroll-left-view">
        <!-- <view class="left-name"
          :style="index == 0 && index == curIndex && type == 2?'border-top: 2rpx solid #F4F4F4;':'border-top: 2rpx solid #f9f9f9'"
          @click="leftClick(item,index,2)" v-for="(item,index) in pageData[2].children" :key="index"
          :class="index == curIndex && type == 2?'left-name-act':''">
          {{item.name}}
        </view>
        <view class="left-name" @click="leftClick(item,index,1)" v-for="(item,index) in pageData[1].children"
          :key="index" :class="index == curIndex && type == 1?'left-name-act':''">
          {{item.name}}
        </view> -->
        <view class="left-name" @click="leftClick(item,index)" v-for="(item,index) in pageData[1].children" :key="index" :class="index == curIndex?'left-name-act':''" :style="index == 0 && index == curIndex?'border-top: 2rpx solid #F4F4F4;':'border-top: 2rpx solid #f9f9f9'">
          {{item.name}}
        </view>

      </scroll-view>
      <scroll-view :scroll-y="true" scroll-with-animation :scroll-top="scrollTop" @scroll="scroll" class="scroll-right-view">
        <!-- <view class="right-con" v-if="rightData.children && rightData.children.length">
          <block v-if="type == 2">
            <image @click="goPlp(rightData.name,rightData.url,rightData.icon)" class="right-banner b-border"
              :src="rightData.icon" mode="aspectFill" style="height: 270rpx;"></image>
            <view class="catena">
              <view class="catena-item" @click="goPlp(it.name,it.url,rightData.icon)"
                v-for="(it,idx) in rightData.children" :key="idx">
                <view class="catena-box">
                  <image :src="it.icon" mode="aspectFit"></image>
                </view>
                <text>{{it.name}}</text>
              </view>
            </view>
          </block>
          <block v-else>
            <view v-for="(item,index) in rightData.children" :key="index">
              <image class="right-banner" style="height: 250rpx;"
                @click="goPlp(rightData.name,rightData.url,rightData.icon)" :src="item.icon" mode="aspectFill"></image>
              <view class="goods">
                <view class="goods-item observer_item" @click="goPdp(it)" v-for="(it,idx) in item.goodsChildren"
                  :key="idx" :data-skucode="it.skus[0].code" :data-title="it.title" :data-spucode="it.code"
                  :data-price="it.skus[0].salePrice.amount"
                  :data-image="it.images.length && it.images[0].url ? it.images[0].url : ''">
                  <image :src="it.images[0].url" mode="aspectFit"></image>
                  <text class="goods-title">{{it.title}}</text>
                  <text>￥{{it.skus[0].salePrice.amount | formatMoney}}</text>
                </view>
              </view>
            </view>
          </block>
          <view class="tsall" @click="goPlp(rightData.name,rightData.url,rightData.icon)">
            <text>探索全部</text>
          </view>
        </view> -->
        <view class="right-con" v-if="JSON.stringify(rightData) != '{}'">
          <image v-if="rightData.icon" @click="goPlp(rightData.name,rightData.url,rightData.icon)" class="right-banner b-border" :src="rightData.icon" mode="aspectFill" style="height: 270rpx;" :lazy-load="true"></image>
          <block>
            <view v-for="(item,index) in rightData.children" :key="index">
              <image class="right-banner" style="height: 250rpx;" @click="goPlp(item.name,item.url,item.icon,item.remark)" :src="item.icon" mode="aspectFill" :lazy-load="true">
              </image>
              <view class="goods">
                <view class="goods-item observer_item" @click="goPdp(it)" v-for="(it,idx) in item.goodsChildren" :key="idx" :data-skucode="it.skus[0].code" :data-title="it.title" :data-spucode="it.code" :data-price="it.skus && it.skus.length && it.skus[0].salePrice.amount ? it.skus[0].salePrice.amount : 0" :data-image="it.images.length && it.images[0].url ? it.images[0].url : ''">
                  <image :src="it.images[0].url" mode="aspectFit" :lazy-load="true"></image>
                  <text class="goods-title">{{it.title}}</text>
                  <text class="goods-price" v-if="it.skus && it.skus.length && it.skus[0].salePrice.amount">￥{{it.skus[0].salePrice.amount | formatMoney}}</text>
                </view>
              </view>
            </view>
          </block>
          <view class="tsall" v-if="rightData.url" @click="goPlp(rightData.name,rightData.url,rightData.icon)">
            <text>探索全部</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import {
  mapActions,
  mapGetters,
  mapMutations,
} from 'vuex';
import {
  priceFormat,
  imgUrlReplace,
} from '@/utils/utils';
import searchInput from '@/components/searchInput';

export default {
  components: {
    searchInput,
  },
  data () {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      pageData: [],
      curIndex: 0,
      rightData: {},
      type: 2,
      scrollTop: 0,
      old: {
        scrollTop: 0,
      },
    }
  },
  watch: {
    'rightData.children': {
      immediate: true,
      handler (n) {
        if (this.type != 2 && n && n.length && n.find((item) => item.hasOwnProperty('goodsChildren'))) {
          this.observer();
        }
      },
    },
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
    // this.rightData = res[1].children[0];
    this.pageData = res;
    this.getProduct();
    // const allSpuCodes = [];
    // if (res[1].children[0].children) {
    //   res[1].children[0].children.forEach((item) => {
    //     item.children && allSpuCodes.push(...item.children[0].spuCodes)
    //   })
    //   this.getProduct(res[1].children[0], [...new Set(allSpuCodes)], 0);
    // }
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
    leftClick (data, index, type) {
      this.curIndex = index;
      this.rightData = data;
      this.scrollTop = this.old.scrollTop
      this.$nextTick(() => {
        this.scrollTop = 0
      });
    },
    // leftClick(data, index) {
    //   this.scrollTop = this.old.scrollTop
    //   this.$nextTick(() => {
    //     this.scrollTop = 0
    //   });
    //   this.curIndex = index;
    //   if (data.children && data.children[0].hasOwnProperty("goodsChildren")) {
    //     this.rightData = data;
    //   } else {
    //     this.rightData = {};
    //     const allSpuCodes = [];
    //     if (data.children && data.children.length) {
    //       data.children.forEach(item => {
    //         item.children && allSpuCodes.push(...item.children[0].spuCodes)
    //       })
    //     }
    //     this.getProduct(data, [...new Set(allSpuCodes)], index);
    //   }
    // },
    scroll (e) {
      this.old.scrollTop = e.detail.scrollTop
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

    // getProduct(data, codes, index) {
    //   this.categoryProductList(codes).then((list) => {
    //     if (data.children) {
    //       data.children.forEach((it) => {
    //         it.goodsChildren = [];
    //         it.children[0].spuCodes.forEach((itd) => {
    //           const pushItem = list.find((itdc) => itdc.code == itd && itdc.onShelves);
    //           if (pushItem) {
    //             it.goodsChildren.push(pushItem)
    //           }
    //         })
    //       })
    //     }
    //     this.rightData = data;
    //   })
    // },
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
$fontColor: #1d1d1d;
.content {
  display: flex;
  padding-top: 20upx;
}
.scroll-left-view {
  width: 240upx;
  background-color: #f9f9f9;
}
.left-name {
  font-size: 24upx;
  line-height: 90upx;
  box-sizing: border-box;
  width: 240upx;
  height: 90upx;
  text-align: center;
  color: $fontColor;
}
.left-name-act {
  border-bottom: 8upx solid #e3f0ea;
  background-color: #fff;
}
.scroll-right-view {
  height: 100%;
  .right-con {
    width: 470upx;
    margin: 0 auto;
    .right-banner {
      display: block;
      width: 100%;
      margin-bottom: 20upx;
    }
    .b-border {
      border-bottom: 10upx solid #e3f0ea;
    }
    .goods {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      .goods-item {
        position: relative;
        width: 224upx;
        padding-bottom: 70upx;
        image {
          width: 224upx;
          height: 224upx;
          border: 2upx solid #f4f4f4;
        }
        .goods-title {
          line-height: 40rpx;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;

          -webkit-line-clamp: 1;
        }
        .goods-price {
          position: absolute;
          bottom: 30upx;
          width: 100%;
          margin: 0;
        }
        text {
          font-size: 24upx;
          line-height: 26rpx;
          display: block;
          margin: 10upx 10upx 0;
          text-align: center;
          color: $fontColor;
        }
      }
    }
    .catena {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      .catena-item {
        width: 224upx;
        .catena-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 146upx;
          border: 2upx solid #f4f4f4;
          image {
            width: 120upx;
            height: 120upx;
          }
        }
        text {
          font-size: 24upx;
          display: block;
          margin: 25upx 10upx;
          text-align: center;
          color: $fontColor;
        }
      }
    }
    .tsall {
      display: flex;
      justify-content: center;
      padding: 30upx 0;
      text {
        font-size: 24upx;
        padding: 0 5upx 8upx;
        color: #616568;
        border-bottom: 2upx solid #8e8e8e;
      }
    }
  }
}

</style>
