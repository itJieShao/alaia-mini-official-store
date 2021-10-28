<template>
  <view class="product">
    <view class="title">
      <com-title :title="content.title" :subtitle="content.sub_title" />
    </view>
    <image class="banner" :src="content.source_url" mode="aspectFill"></image>
    <view v-if="showTab" class="product-tab">
      <text @click="changeTab(index)" :class="item.checked?'act':''" v-for="(item,index) in tabList"
        :key="index">{{item.title}}</text>
    </view>
    <view class="product-content">
      <view class="product-item" @click="goPdp(it.code)" v-for="(it,index) in swiperList" :key="index">
        <image :src="it.images[0].url" mode="aspectFit" :lazy-load="true"></image>
        <view class="goods-label">
          新品
        </view>
        <view class="goods-title" v-if="it.title">{{it.title}}</view>
        <view class="goods-price" v-if="it.skus &&　it.skus.length>0 &&　it.skus[0].salePrice.amount">¥
          {{it.skus[0].salePrice.amount | formatMoney}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex';
  import ComTitle from '../comTitle/comTitle';
  import {
    HOME_PRODUCT_CONFIG,
    HOME_RECOMMEND_PRODUCT_CONFIG
  } from '@/constants/cms';
  import {
    parseCmsContent
  } from '@/utils/cms';
  import {
    navigateTo,
    priceFormat
  } from '@/utils/utils';
  import customButton from '@/components/button/normal.vue';
  import {
    OSS_URL
  } from '@/constants/env';
  export default {
    props: {
      showTab: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        tabList: [],
        swiperList: [],
        content: {},
      }
    },
    computed: {
      ...mapGetters('cms', ['cmsContentMap'])
    },
    watch: {
      cmsContentMap(newValue) {
        // todo : 需要绑定数据
        const content = this.getCmsContentData(newValue, this.showTab ? HOME_RECOMMEND_PRODUCT_CONFIG :
          HOME_PRODUCT_CONFIG, 'content');
        const contentData = content[0];
        const swiperList = this.getCmsContentData(newValue, this.showTab ? HOME_RECOMMEND_PRODUCT_CONFIG :
          HOME_PRODUCT_CONFIG, 'swiper_group', this.showTab);
        if (this.showTab) {
          swiperList.forEach(item => {
            item.fieldContents.checked = false;
            item.fieldContents.codes = item.groupChildren[0].sku_list.map(it => it.fieldContents.sku_code)
          })
          swiperList[0].fieldContents.checked = true;
          this.tabList = swiperList.map(item => item.fieldContents);
          this.getProductList(this.tabList[0].codes).then((res) => {
            this.$set(this.tabList[0], "productList", res);
            this.swiperList = res;
          })
        } else {
          const codes = swiperList.map(item => item.sku_code);
          this.getProductList(codes).then((res) => {
            this.swiperList = res;
          })
        }
        const {
          source_url
        } = contentData;
        if (source_url && !/^(http|https)/.test(source_url)) {
          contentData.source_url = `${OSS_URL}${source_url}`
        }
        this.content = contentData;
      }
    },
    components: {
      ComTitle,
      customButton,
    },
    filters: {
      formatMoney(val) {
        if (val) {
          return priceFormat(val);
        }
        return '0';
      },
    },
    methods: {
      ...mapActions('product', ['getProductList']),
      getCmsContentData(resData, config, name, getPar) {
        const {
          moduleCode,
          contentCode
        } = config;
        try {
          return parseCmsContent(resData[contentCode], name, moduleCode, getPar);
        } catch (error) {
          console.error(error)
        }
      },
      changeTab(index) {
        this.tabList.forEach(item => {
          item.checked = false;
        })
        this.$set(this.tabList[index], 'checked', true);
        if (this.tabList[index].hasOwnProperty("productList")) {
          this.swiperList = this.tabList[index].productList;
        } else {
          this.getProductList(this.tabList[index].codes).then((res) => {
            this.$set(this.tabList[index], "productList", res);
            this.swiperList = res;
          })
        }
      },
      goPdp(code) {
        if (code) {
          this.$emit('handleProductClick', code);
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  $color: #1D1D1D;

  .product {
    background-color: #fff;

    .title {
      padding: 122rpx 0 40rpx;
    }

    .banner {
      display: block;
      width: 750rpx;
      height: 480rpx;
    }

    .product-tab {
      position: sticky;
      top: 0;
      width: 100%;
      height: 84rpx;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background-color: #fff;

      text {
        display: block;
        height: 100%;
        line-height: 84rpx;
        color: #8E8E8E;
        font-size: 28rpx;
        padding: 0 20rpx;
      }

      .act {
        color: $color;
        font-weight: bold;
        border-bottom: 2rpx solid $color;
      }
    }

    .product-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .product-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 370rpx;
        color: $color;
        margin-bottom: 40rpx;

        image {
          display: block;
          width: 100%;
          height: 510rpx;
          background-color: #F7F7F7;
        }

        .goods-label {
          font-family: PingFangSC, PingFangSC-Medium;
          font-size: 24rpx;
          line-height: 28rpx;
          padding: 8rpx;
          margin-top: 30rpx;
          font-weight: bold;
        }

        .goods-title {
          font-family: PingFangSC, PingFangSC-Regular;
          display: block;
          font-size: 28rpx;
          line-height: 28rpx;
          margin: 32rpx auto 24rpx;
        }

        .goods-price {
          font-family: PingFangSC, PingFangSC-Regular;
          font-size: 28rpx;
          line-height: 28rpx;
        }
      }
    }
  }
</style>
