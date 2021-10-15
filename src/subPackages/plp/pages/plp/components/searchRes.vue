<template>
  <view class="res-wrap">
    <image v-if="img" class="banner" :src="img" mode="widthFix" :lazy-load="true"></image>
    <view class="info">
      <view class="keyword" v-if="keyWord">{{keyWord}}</view>
      <view class="remark" v-if="remark">{{remark}}</view>
      <view class="search-box" @click="linkSearch">
        <image class="icon icon-search" src="https://res-tasaki.baozun.com/static/images/icon-search.png" mode="widthFix"></image>
        <text class="txt">搜索商品</text>
      </view>
    </view>
    <view class="res-font">共{{totalCount}}个作品<text class="filter" v-if="filterKeyWord">筛选条件：{{filterKeyWord}}</text></view>
    <view class="menu-box">
      <scroll-view class="menu" scroll-x="true" bindscroll="scroll">
        <view :class="['item',item.select?'active':'']" v-for="(item,index) in menuList" :key="index" @click="selectMenu(item)">{{item.name}}</view>
      </scroll-view>
    </view>
    <goods-list :goodsList="goodsList" @updateList="updateList" @goFilter="goFilter" :isStatic="isStatic" />
    <!-- <view v-if="goTopFlag" class="goTop" @click="scrollToTop">
      <text class="icon-font icon-icon-yijianxiangshang"></text>
    </view> -->
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
      default: '',
    },
    keyWord: {
      type: String,
      default: '',
    },
    remark: {
      type: String,
      default: '',
    },
    filterKeyWord: {
      type: String,
      default: '',
    },
    goodsList: {
      type: Array,
      default: () => [],
    },
    menuList: {
      type: Array,
      default: () => [],
    },
    isStatic: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    goodsList,
  },
  methods: {
    updateList (type, sort) {
      this.$emit('updateList', type, sort)
    },
    goFilter () {
      this.$emit('goFilter');
    },
    selectMenu (e) {
      this.$emit('selectMenu', e);
    },
    scrollToTop () {
      this.$emit('scrollToTop')
    },
    linkSearch () {
      wx.navigateTo({ url: '/subPackages/search/pages/index' })
    },
    scroll () { },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.res-wrap {
  font-size: 0;
}
.banner {
  width: 100%;
  height: rpx(200);
}
.info {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.keyword {
  font-family: PingFangSC, PingFangSC-Semibold;
  font-size: rpx(16);
  font-weight: 600;
  line-height: rpx(22);
  margin-top: rpx(20);
  text-align: center;
  letter-spacing: 2px;
  color: #1d1d1d;
}
.remark {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: rpx(12);
  font-weight: 400;
  line-height: rpx(17);
  margin-top: rpx(17);
  padding: 0 rpx(70);
  text-align: center;
  letter-spacing: 1px;
  color: #616161;
}
.search-box {
  margin-top: rpx(30);
  padding: rpx(6) rpx(16);
  border: rpx(1) solid #f7f7f7;
  border-radius: rpx(15);
  .icon {
    width: rpx(14);
    height: rpx(14);
    margin-right: rpx(8);
  }
  .txt {
    font-family: Lato, Lato-Regular;
    font-size: rpx(12);
    font-weight: 400;
    line-height: rpx(15);
    text-align: center;
    letter-spacing: 1px;
    color: #1d1d1d;
  }
}
.res-font {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: rpx(12);
  font-weight: 400;
  line-height: rpx(17);
  margin-top: rpx(21);
  margin-bottom: rpx(12);
  padding: 0 rpx(15);
  text-align: left;
  letter-spacing: 1px;
  color: #1d1d1d;
  .filter {
    margin-left: rpx(21);
  }
}
.goTop {
  position: fixed;
  right: 34rpx;
  bottom: 54rpx;
  text {
    line-height: 62rpx;
    display: inline-block;
    width: 62rpx;
    height: 62rpx;
    text-align: center;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 6px 20px 0 rgba(102, 102, 102, .1);
    .icon-font {
      font-size: 36rpx;
    }
  }
}
.menu-box {
  // position: sticky;
  // z-index: 99;
  // top: rpx(176);
  // left: 0;
  // width: auto;
  background-color: #fff;
  .menu {
    margin-left: rpx(16);
    white-space: nowrap;
    .item {
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: rpx(14);
      font-weight: 400;
      line-height: rpx(20);
      display: inline-block;
      margin-right: rpx(35);
      padding: rpx(11) 0;
      text-align: center;
      color: #8e8e8e;
      border-bottom: rpx(1) solid transparent;
    }
    .active {
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      color: #1d1d1d;
      border-color: #000;
    }
  }
}

</style>
