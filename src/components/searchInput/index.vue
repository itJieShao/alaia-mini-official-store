<template>
  <view class="search-input">
    <input :disabled="disabled" type="text" placeholder="搜索关键词" placeholder-style="color:#616161" @confirm="searchClick" @blur="searchClick" v-model="keyword" />
    <text class="icon-font icon-search"></text>
  </view>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      keyword: '',
    }
  },
  watch: {
    '$store.state.search.clearKeyWordFlag': function () {
      this.keyword = '';
    },
  },
  methods: {
    searchClick () {
      if (this.keyword) {
        this.$emit('getProduct', { name: this.keyword });
        this.$sr.track('search', {
          keyword: this.keyword,
        });
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/utilities.scss';
.search-input {
  display: flex;
  align-items: center;
  margin: 0 rpx(16);
  margin-top: rpx(43);
  padding-bottom: rpx(10);
  border-bottom: rpx(1) solid #1d1d1d;
  .icon-font {
    font-size: rpx(16);
    color: #1d1d1d;
  }
  input {
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: rpx(14);
    font-weight: 400;
    line-height: rpx(20);
    flex: 1;
    text-align: left;
    letter-spacing: 1px;
    color: #1d1d1d;
  }
}

</style>
