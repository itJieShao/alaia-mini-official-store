<template>
  <view>
    <image v-if="img" class="banner" :src="img" mode="widthFix" :lazy-load="true"></image>
    <text class="res-font" v-if="showKeyWord">共{{totalCount}}个作品，筛选条件：{{showKeyWord}}</text>
    <text class="res-font" v-else>共{{totalCount}}个作品</text>
    <goods-list :goodsList="goodsList" @updateList="updateList" @goFilter="goFilter" />
    <view class="logo-box">
      <view>
        TASAKI
      </view>
    </view>
    <view v-if="goTopFlag" class="goTop" @click="scrollToTop">
      <text class="icon-font icon-icon-yijianxiangshang"></text>
    </view>
  </view>
</template>

<script>
  import searchInput from '@/components/searchInput';
  import goodsList from '@/components/goodsList';
  export default {
    props: {
      goTopFlag: {
        type: Boolean,
        default: false,
      },
      totalCount: {
        type: Number,
        default: 0,
      },
      img: {
        type: String,
        default: "",
      },
      keyWord: {
        type: String,
        default: "",
      },
      filterKeyWord: {
        type: String,
        default: "",
      },
      goodsList: {
        type: Array,
        default: [],
      },
    },
    computed: {
      showKeyWord() {
        return this.keyWord + this.filterKeyWord;
      }
    },
    components: {
      goodsList
    },
    methods: {
      updateList(type, sort) {
        this.$emit("updateList", type, sort)
      },
      goFilter() {
        this.$emit("goFilter");
      },
      scrollToTop() {
        this.$emit("scrollToTop")
      }
    }
  }
</script>

<style lang="scss" scoped>
  .banner {
    display: block;
    width: 750upx;
    margin-top: 40upx;
  }

  .res-font {
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    width: 680upx;
    font-family: 'HiraginoSansGB';
    margin: 40upx auto;
    font-size: 24upx;
    color: #616568;
  }

  .logo-box {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20upx 0 60upx;

    view {
      font-size: 28upx;
      color: #050101;
      border-bottom: 8upx solid #E3F0EA;
      padding: 6upx 20upx;
      letter-spacing: 6upx;
    }
  }

  .goTop {
    position: fixed;
    right: 34rpx;
    bottom: 54rpx;

    text {
      display: inline-block;
      border-radius: 50%;
      width: 62rpx;
      height: 62rpx;
      background: #FFFFFF;
      box-shadow: 0px 6px 20px 0px rgba(102, 102, 102, 0.1);
      text-align: center;
      line-height: 62rpx;

      .icon-font {
        font-size: 36rpx;
      }
    }
  }
</style>
