<template>
  <view class="res-wrap">
    <image v-if="img" class="banner" :src="img" mode="widthFix" :lazy-load="true"></image>
    <view class="res-font">共{{totalCount}}个作品<text class="filter" v-if="showKeyWord">筛选条件：{{showKeyWord}}</text></view>
    <goods-list :goodsList="goodsList" @updateList="updateList" @goFilter="goFilter" />
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
      default: '',
    },
    keyWord: {
      type: String,
      default: '',
    },
    filterKeyWord: {
      type: String,
      default: '',
    },
    goodsList: {
      type: Array,
      default: [],
    },
  },
  computed: {
    showKeyWord () {
      return this.keyWord + this.filterKeyWord;
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
    scrollToTop () {
      this.$emit('scrollToTop')
    },
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
.res-font {
  font-family: PingFangSC, PingFangSC-Regular;
  font-size: rpx(12);
  font-weight: 400;
  line-height: rpx(17);
  margin-top: rpx(21);
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

</style>
