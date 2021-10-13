<template>
  <view>
    <custom-nav-bar left-arrow="left" :head-border="isHeadBorder" :head-blank="isHeadBlank" :head-font-color="isHeaderBlackColor" />
    <!-- <view :style="{ 'padding-top': ktxStatusHeight }"></view> -->
    <block v-if="pageShow">
      <search-res v-if="goodsList.length" :totalCount="totalCount" :keyWord="keyWord" :filterKeyWord="filterKeyWord" :img="img" :goodsList="goodsList" @updateList="updateList" @goFilter="goFilter" @scrollToTop="scrollToTop" :goTopFlag="goTopFlag" />
      <search-no-res v-else :keyWord="keyWord" :totalCount="totalCount" />
    </block>
  </view>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import searchRes from './components/searchRes';
import searchNoRes from './components/searchNoRes';

export default {
  components: {
    searchRes,
    searchNoRes,
  },
  data () {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      isHeadBorder: false, // header border是否展示
      isHeadBlank: true, // header 是否透明
      isHeaderBlackColor: false, // header 字体颜色
      keyWord: '',
      filterKeyWord: '',
      img: '',
      goodsList: [],
      pageShow: false,
      params: {
        filters: {
          spuSaleStatuses: ['ON_SHELF'],
          categories: '',
          condition: {
            operator: 'AND',
            conditions: [],
          },
        },
        sort: {},
        pageInput: {
          first: 10,
        },
      },
      moreFlag: true,
      totalCount: 0,
      updateFlag: false,
      goTopFlag: false,
      remark: '',
    };
  },
  onLoad (option) {
    const {
      name,
      code,
      img,
      remark,
    } = option;
    this.params.filters.categories = code || '';
    if (remark) {
      this.params.filters.condition.conditions = [{
        operator: 'OR',
        conditions: [{
          key: 'attrList.valueCode',
          value: remark,
          fqRule: 'EQ',
        }],
      },
      {
        operator: 'OR',
        conditions: [{
          key: 'attrList.valueCode',
          value: name,
          fqRule: 'EQ',
        }],
      },
      ];
      this.remark = remark
    }

    this.keyWord = name || '';
    this.img = img || '';
    this.getProduct();
  },
  watch: {
    '$store.state.goodsFilter.fromTypeData1.goodsList': {
      handler (newData, oldData) {
        this.goodsList = newData;
      },
    },
    '$store.state.goodsFilter.fromTypeData1.pageInfo': {
      handler (newData, oldData) {
        this.totalCount = newData.totalCount;
        if (newData.hasNextPage) {
          this.moreFlag = true;
        } else {
          this.moreFlag = false;
        }
      },
    },
    '$store.state.goodsFilter.fromTypeData1.plp_params': {
      handler (newData, oldData) {
        if (newData.filters.condition.conditions.length) {
          let keyWordString = '';
          newData.filters.condition.conditions.forEach((item) => {
            if (item.hasOwnProperty('typeIndex')) {
              if (item.value != this.keyWord) {
                keyWordString += `、${item.value}`;
              }
            }
          });
          if (keyWordString) {
            this.filterKeyWord = keyWordString;
          }
        } else {
          this.filterKeyWord = '';
        }
        this.params = newData;
      },
    },
  },
  onUnload () {
    this.clearFilterData(1);
  },
  onReachBottom () {
    if (this.moreFlag) {
      this.getProduct();
    }
  },
  onPullDownRefresh () {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  onPageScroll (e) {
    if (e.scrollTop > 1000) {
      this.goTopFlag = true;
    } else {
      this.goTopFlag = false;
    }
  },
  onShareAppMessage (res) {
    return {
      title: 'TASAKI塔思琦线上旗舰店',
      path: `/subPackages/plp/pages/plp/index?name=${this.keyWord}&code=${this.params.filters.categories}`,
    };
  },
  methods: {
    ...mapMutations('goodsFilter', ['clearFilterData']),
    ...mapActions('search', ['searchProduct']),
    getProduct () {
      uni.showLoading({
        title: '加载中...',
      });
      const urlParams = JSON.parse(JSON.stringify(this.params));
      if (urlParams.filters.condition.conditions.length) {
        const priceArr = urlParams.filters.condition.conditions.filter(
          (item) => !item.hasOwnProperty('typeIndex'),
        );
        const conditions = urlParams.filters.condition.conditions.filter((item) => item.hasOwnProperty('typeIndex'));
        const result = conditions.reduce((initArray, item, xindex, array) => {
          const fIndex = initArray.findIndex(
            (it) => it.conditions[0].typeIndex === item.typeIndex,
          );
          if (fIndex !== -1) {
            initArray[fIndex].conditions.push(item);
          } else {
            initArray.push({
              operator: 'OR',
              conditions: [item],
            });
          }
          return initArray;
        }, []);
        if (result.length) {
          result.forEach((item) => {
            item.conditions.forEach((it) => {
              delete it.typeIndex;
            });
          });
        }
        urlParams.filters.condition.conditions = priceArr.concat(result);
      } else {
        delete urlParams.filters.condition;
      }
      this.searchProduct(urlParams).then(({
        list,
        pageInfo,
      }) => {
        this.pageShow = true;
        if (pageInfo.hasNextPage) {
          this.moreFlag = true;
          this.params.pageInput.after = pageInfo.endCursor;
        } else {
          this.moreFlag = false;
        }
        this.totalCount = pageInfo.totalCount;
        if (this.updateFlag) {
          this.updateFlag = false;
          this.goodsList = list;
        } else {
          this.goodsList = this.goodsList.concat(list || []);
        }
        for (let i = 1; i < this.goodsList.length; i += 4) {
          this.goodsList[i].hasBorder = true;
          if (this.goodsList[i + 1]) {
            this.goodsList[i + 1].hasBorder = true;
          }
        }
        uni.hideLoading();
      });
    },
    updateList (type, sort) {
      if (type == 1) {
        this.$set(this.params, 'sort', sort);
      } else if (sort) {
        this.params.filters.condition.conditions.unshift({
          key: 'hasInventory',
          value: 'true',
          fqRule: 'EQ',
        })
      } else {
        const index = this.params.filters.condition.conditions.findIndex((item) => item.key == 'hasInventory');
        this.params.filters.condition.conditions.splice(index, 1);
      }
      this.params.pageInput.after && delete this.params.pageInput.after;
      this.updateFlag = true;
      this.getProduct();
    },
    goFilter () {
      this.params.pageInput.after && delete this.params.pageInput.after;
      uni.navigateTo({
        url: `/subPackages/goodsFilter/pages/index?params=${encodeURIComponent(
          JSON.stringify(this.params),
        )}&type=1&resNum=${this.totalCount}&remark=${this.remark}`,
      });
    },
    scrollToTop () {
      uni.pageScrollTo({
        scrollTop: 0,
      });
    },
  },
};
</script>
