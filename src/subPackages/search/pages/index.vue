<template>
  <view>
    <custom-nav-bar left-arrow="left" title="搜索" />
    <view :style="{'padding-top':ktxStatusHeight}"></view>
    <search-default v-if="searchPageType === 1" :hotWords="hotWords" @getProduct="searchClick"></search-default>
    <search-res v-if="searchPageType === 2" @getProduct="searchClick" @goFilter="goFilter" @updateList="updateList" :keyword="keyword" :filterKeyWord="filterKeyWord" :goodsList="goodsList" :totalCount="totalCount" @scrollToTop="scrollToTop" :goTopFlag="goTopFlag">
    </search-res>
    <search-no-res v-if="searchPageType === 3" :keyword="keyword" @getProduct="searchClick"></search-no-res>
  </view>
</template>

<script>
import { getCmsContent } from '@/service/apis';
import { get, debounce } from '@/utils/utilityOperationHelper';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import searchDefault from './components/searchDefault';
import searchRes from './components/searchRes';
import searchNoRes from './components/searchNoRes';

export default {
  components: {
    searchDefault,
    searchRes,
    searchNoRes,
  },
  data () {
    return {
      keyword: {},
      filterKeyWord: '',
      goodsList: [],
      searchPageType: 1,
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      hotWords: [], // 热词
      historyWords: uni.getStorageSync('searchHistoryData') ? JSON.parse(uni.getStorageSync('searchHistoryData'))
        : [],
      params: {
        filters: {
          // businessCode: 'MOBILE',
          spuSaleStatuses: ['ON_SHELF'],
          keyword: '',
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
    }
  },
  watch: {
    '$store.state.goodsFilter.fromTypeData2.goodsList': {
      handler (newData, oldData) {
        this.goodsList = newData;
      },
    },
    '$store.state.goodsFilter.fromTypeData2.pageInfo': {
      handler (newData, oldData) {
        this.totalCount = newData.totalCount;
        if (newData.hasNextPage) {
          this.moreFlag = true;
        } else {
          this.moreFlag = false;
        }
      },
    },
    '$store.state.goodsFilter.fromTypeData2.plp_params': {
      handler (newData, oldData) {
        if (newData.filters.condition.conditions.length) {
          const filterKeyWord = [];
          newData.filters.condition.conditions.forEach((item) => {
            if (item.hasOwnProperty('typeIndex')) {
              filterKeyWord.push(item.value);
            }
          })
          this.filterKeyWord = filterKeyWord.join('、')
        } else {
          this.filterKeyWord = '';
        }
        this.params = newData;
      },
    },
  },
  onUnload () {
    this.clearFilterData(2);
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
  created () {

  },
  methods: {
    ...mapMutations('search', ['clearKeyWord', 'clearSelect']),
    ...mapMutations('goodsFilter', ['clearFilterData']),
    ...mapActions('search', ['searchProduct']),
    getProduct: debounce(function () {
      uni.showLoading({
        title: '加载中...',
      });
      const urlParams = JSON.parse(JSON.stringify(this.params));
      console.log('urlParams *****', urlParams);
      if (urlParams.filters.condition.conditions.length) {
        const priceArr = urlParams.filters.condition.conditions.filter((item) => !item.hasOwnProperty('typeIndex'));
        const conditions = urlParams.filters.condition.conditions.filter((item) => item.hasOwnProperty('typeIndex'));
        const result = conditions.reduce((initArray, item, xindex, array) => {
          const fIndex = initArray.findIndex((it) => it.conditions[0].typeIndex === item.typeIndex);
          if (fIndex !== -1) {
            initArray[fIndex].conditions.push(item)
          } else {
            initArray.push({
              operator: 'OR',
              conditions: [item],
            })
          }
          return initArray
        }, []);
        if (result.length) {
          result.forEach((item) => {
            item.conditions.forEach((it) => {
              delete it.typeIndex;
            })
          })
        }
        urlParams.filters.condition.conditions = priceArr.concat(result);
      } else {
        delete urlParams.filters.condition
      }
      // if (this.keyword.search_type === 'category') {
      //   urlParams.filters.keyword = '';
      //   urlParams.filters.categories = this.keyword.search_value;
      // } else if (this.keyword.search_type === 'keywords') {
      //   urlParams.filters.keyword = this.keyword.search_value;
      //   this.keyword.name = this.keyword.search_value;
      //   // urlParams.filters.categories = '';
      // }
      console.log('urlParams ***** ===>', urlParams);
      this.searchProduct(urlParams).then(({
        list,
        pageInfo,
      }) => {
        this.clearKeyWord();
        const searchHistoryData = uni.getStorageSync('searchHistoryData') ? JSON.parse(uni.getStorageSync(
          'searchHistoryData',
        )) : [];
        console.log('keyword *****************', this.keyword);
        console.log('searchHistoryData **************', searchHistoryData)
        const index = searchHistoryData.findIndex((item) => item.name == this.keyword.name);
        if (index !== -1) {
          searchHistoryData.unshift(searchHistoryData.splice(index, 1)[0])
        } else {
          searchHistoryData.unshift({
            name: this.keyword.name,
            search_value: this.keyword.name,
          });
        }
        if (!this.keyword.search_type) {
          uni.setStorageSync('searchHistoryData', JSON.stringify(searchHistoryData));
        }
        if (list && list.length > 0) {
          this.searchPageType = 2;
        } else {
          this.searchPageType = 3;
        }
        if (this.updateFlag) {
          this.updateFlag = false;
          this.goodsList = list;
        } else {
          this.goodsList = this.goodsList.concat(list || []);
        }
        if (pageInfo.hasNextPage) {
          this.moreFlag = true;
          this.params.pageInput.after = pageInfo.endCursor;
        } else {
          this.moreFlag = false;
        }
        this.totalCount = pageInfo.totalCount;
        for (let i = 1; i < this.goodsList.length; i += 4) {
          this.goodsList[i].hasBorder = true;
          if (this.goodsList[i + 1]) {
            this.goodsList[i + 1].hasBorder = true;
          }
        }
        uni.hideLoading();
      })
    }, 300),
    searchClick (keyword, refreshFlag) {
      this.keyword = keyword;
      if (keyword.search_type === 'category') {
        this.$set(this.params.filters, 'categories', keyword.search_value);
        delete this.params.filters.keyword;
      } else if (keyword.search_type === 'keywords') {
        this.keyword.name = this.keyword.search_value;
        this.params.filters.keyword = keyword.search_value;
      } else {
        this.params.filters.keyword = keyword.name;
      }
      if (refreshFlag) {
        this.updateFlag = true;
        this.params.pageInput.after && delete this.params.pageInput.after;
        this.params.filters.condition = {
          operator: 'AND',
          conditions: [],
        };
        this.filterKeyWord = '';
        this.clearSelect();
      }
      this.getProduct();
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
      if (this.params.pageInput.after) delete this.params.pageInput.after;
      uni.navigateTo({
        url: `/subPackages/goodsFilter/pages/index?params=${encodeURIComponent(JSON.stringify(this.params))}&type=2&resNum=${this.totalCount}`,
      })
    },
    scrollToTop () {
      uni.pageScrollTo({
        scrollTop: 0,
      })
    },
    delHistoryWords () {
      uni.removeStorageSync('searchHistoryData');
      this.historyWords = [];
    },

    // 获取HOT热词
    async getHotWordList () {

    },
  },
}
</script>
