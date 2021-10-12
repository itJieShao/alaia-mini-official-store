<template>
  <view class="search-input">
    <image class="icon-search" src="https://res-tasaki.baozun.com/static/images/icon-search.png"
      mode="widthFix">
    </image>
    <input :disabled="disabled" type="text" placeholder="请输入作品名称/型号等关键词" placeholder-style="color:#bbb;"
      @confirm="searchClick" @blur="searchClick" v-model="keyword" />
  </view>
</template>

<script>
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        keyword: "",
      }
    },
    watch: {
      "$store.state.search.clearKeyWordFlag"() {
        this.keyword = "";
      },
    },
    methods: {
      searchClick() {
        if (this.keyword) {
          this.$emit("getProduct", {name:this.keyword});
          this.$sr.track("search", {
            "keyword": this.keyword,
          });
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .search-input {
    width: 700upx;
    margin: 0 auto 20upx;
    padding: 50upx 0 20upx;
    display: flex;
    align-items: center;
    border-bottom: 1upx solid #ddd;

    image {
      width: 40upx;
      height: 40upx;
    }

    input {
      flex: 1;
      margin-left: 30upx;
      font-size: 24upx;
      color: #333;
      font-family: 'HiraginoSansGB';
    }
  }
</style>
