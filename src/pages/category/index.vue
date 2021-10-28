<template>
  <view>
    <custom-nav-bar left-icon="search" left-text="搜索" title="分类" :head-border="true" :head-font-color="false" />
    <view class="content" :style="{ 'padding-top':ktxStatusHeight }">
      <!-- 分类顶部活动 -->
      <activity-content :config="CATEGORY_ACTIVITY_CONFIG"></activity-content>
      <view class="category-banner">
        <image class="cover" src="https://scm-dam.oss-cn-shanghai.aliyuncs.com/scm-dam/2021-10-22/0.45073679062264826%E4%BD%8D%E5%9B%BE%E5%A4%87%E4%BB%BD%2010.jpg" mode="aspectFill"></image>
        <view class="txt">WS22 COLLECTION</view>
      </view>
      <view class="category">
        <view class="item" v-for="(item,index) in pageData" :key="item.code">
          <view class="title" @click="cutItem(index,item)">{{item.name}}</view>
          <view class="children" v-show="curIndex == index">
            <view class="c-item" v-for="sItem in item.children" :key="sItem.name">
              <!-- 点击空白收起部分 -->
              <view class="mark" @click="cutItem(null)"></view>
              <text class="txt" @click="goPlp(item)">{{ sItem.name }}</text>
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
import { CATEGORY_ACTIVITY_CONFIG } from '@/constants/cms';
import ActivityContent from './components/activityContent';

export default {
  components: { ActivityContent },
  data () {
    return {
      type: 2,
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      pageData: [],
      curIndex: null,
      CATEGORY_ACTIVITY_CONFIG,
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
      if (value.name === '分类') {
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
      title: 'ALAIA线上旗舰店',
      path: '/pages/category/index',
    }
  },
  methods: {
    imgUrlReplace,
    ...mapMutations('globle', ['setTabSelected']),
    ...mapActions('category', ['getCategoryData', 'categoryProductList']),

    cutItem (index, item) {
      this.curIndex = index
      if (item && !item.children) {
        this.goPlp(item)
      }
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
    goPlp (item) {
      const {
        name, url, img, remark,
      } = item;
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
          sku_name: item.title || 'ALAIA', // 若商品无sku_name时，可传spu_name信息
        },
        spu: {
          spu_id: item.code || 'ALAIA', // 若商品无spu_id时，可传sku_id信息
          spu_name: item.title || 'ALAIA', // 若商品无spu_name时，可传sku_name信息
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
@import './index';

</style>
