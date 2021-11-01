<template>
  <view>
    <custom-nav-bar left-icon="search" left-text="搜索" title="分类" :head-border="true" :head-font-color="false" />
    <view class="content" :style="{ 'padding-top':ktxStatusHeight }">
      <!-- 分类顶部活动 -->
      <activity-content :config="CATEGORY_ACTIVITY_CONFIG"></activity-content>
      <view class="category-banner">
        <image class="cover" :src="topIntro.source_url" mode="aspectFill"></image>
        <view class="txt">{{ topIntro.title }}</view>
      </view>
      <view class="category">
        <view class="item" v-for="(item,index) in pageData" :key="item.code">
          <view class="title" @click="cutItem(index,item)">{{item.name}}</view>
          <view class="children" v-show="curIndex == index">
            <view class="c-item" v-for="sItem in item.children" :key="sItem.name">
              <!-- 点击空白收起部分 -->
              <view class="mark" @click="cutItem(null)"></view>
              <text class="txt" @click="goPlp(sItem)">{{ sItem.name }}</text>
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
import { OSS_URL } from '@/constants/env';
import { CATEGORY_ACTIVITY_CONFIG, CATEGORY_TOP_INTRO_CONFIG } from '@/constants/cms';
import { parseCmsContent } from '@/utils/cms';
import ActivityContent from './components/activityContent';

export default {
  components: { ActivityContent },
  data () {
    return {
      type: 2,
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      pageData: [],
      curIndex: null,
      topIntro: {},
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
    this.getTopIntroData();
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
    ...mapActions('cms', ['getCmsContentMapData']),
    cutItem (index, item) {
      this.curIndex = index
      if (item && !item.children) {
        this.goPlp(item)
      }
    },
    async getTopIntroData () {
      const { templateCode, contentCode, moduleCode } = CATEGORY_TOP_INTRO_CONFIG;
      try {
        const cmsContentMap = await this.getCmsContentMapData();
        const introData = parseCmsContent(cmsContentMap[contentCode], templateCode, moduleCode).shift();
        if (introData.source_url && !/^(http|https)/.test(introData.source_url)) {
            introData.source_url = `${OSS_URL}${introData.source_url}`
        }
        this.topIntro = introData;
      } catch (error) {
        console.error(error)
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
      const { url } = item;
      if (url) {
        uni.navigateTo({
          url: `/subPackages/plp/pages/plp/index?code=${url}`,
        })
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
