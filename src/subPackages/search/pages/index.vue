<template>
  <view>
    <custom-nav-bar left-arrow="left" />
    <view :style="{'padding-top':ktxStatusHeight}"></view>
    <search-default v-if="searchPageType === 1" :hotWords="hotWords" :historyWords="historyWords"
      :ktxStatusHeight="ktxStatusHeight" @getProduct="searchClick" @delHistoryWords="delHistoryWords" />
    <search-res v-if="searchPageType === 2" @getProduct="searchClick" @goFilter="goFilter" @updateList="updateList"
      :keyword="keyword" :filterKeyWord="filterKeyWord" :goodsList="goodsList" :totalCount="totalCount"
      @scrollToTop="scrollToTop" :goTopFlag="goTopFlag" />
    <search-no-res v-if="searchPageType === 3" :keyword="keyword" @getProduct="searchClick" />
  </view>
</template>

<script>
  import searchDefault from './components/searchDefault';
  import searchRes from './components/searchRes';
  import searchNoRes from './components/searchNoRes';
  import {
    getHelpList
  } from '@/service/apis';
  import {
    get
  } from '@/utils/utilityOperationHelper';
  import {
    debounce
  } from '@/utils/utilityOperationHelper';
  import {
    mapGetters,
    mapMutations,
    mapActions
  } from "vuex";
  export default {
    components: {
      searchDefault,
      searchRes,
      searchNoRes
    },
    data() {
      return {
        keyword: {},
        filterKeyWord: "",
        goodsList: [],
        searchPageType: 1,
        ktxStatusHeight: getApp().globalData.ktxStatusHeight,
        hotWords: [], // 热词
        historyWords: uni.getStorageSync("searchHistoryData") ? JSON.parse(uni.getStorageSync("searchHistoryData")) :
        [],
        params: {
          filters: {
            // businessCode: 'MOBILE',
            spuSaleStatuses: ['ON_SHELF'],
            keyword: "",
            condition: {
              operator: "AND",
              conditions: [],
            }
          },
          sort: {},
          pageInput: {
            first: 10
          },
        },
        moreFlag: true,
        totalCount: 0,
        updateFlag: false,
        goTopFlag: false,
      }
    },
    watch: {
      "$store.state.goodsFilter.fromTypeData2.goodsList": {
        handler(newData, oldData) {
          this.goodsList = newData;
        },
      },
      "$store.state.goodsFilter.fromTypeData2.pageInfo": {
        handler(newData, oldData) {
          this.totalCount = newData.totalCount;
          if (newData.hasNextPage) {
            this.moreFlag = true;
          } else {
            this.moreFlag = false;
          }
        },
      },
      "$store.state.goodsFilter.fromTypeData2.plp_params": {
        handler(newData, oldData) {
          if (newData.filters.condition.conditions.length) {
            let filterKeyWord = [];
            newData.filters.condition.conditions.forEach(item => {
              if (item.hasOwnProperty("typeIndex")) {
                filterKeyWord.push(item.value);
              }
            })
            this.filterKeyWord = filterKeyWord.join("、")
          } else {
            this.filterKeyWord = "";
          }
          this.params = newData;
        },
      },
    },
    onUnload() {
      this.clearFilterData(2);
    },
    onPullDownRefresh() {
      wx.stopPullDownRefresh(); // 阻止下拉刷新
    },
    onPageScroll(e) {
      if (e.scrollTop > 1000) {
        this.goTopFlag = true;
      } else {
        this.goTopFlag = false;
      }
    },
    onReachBottom() {
      if (this.moreFlag) {
        this.getProduct();
      }
    },
    created() {
      this.getHelpList()
    },
    methods: {
      ...mapMutations('search', ['clearKeyWord','clearSelect']),
      ...mapMutations('goodsFilter', ['clearFilterData']),
      ...mapActions('search', ['searchProduct']),
      getProduct: debounce(function() {
        uni.showLoading({
          title: '加载中...',
        });
        let urlParams = JSON.parse(JSON.stringify(this.params));
        console.log('urlParams *****', urlParams);
        if (urlParams.filters.condition.conditions.length) {
          let priceArr = urlParams.filters.condition.conditions.filter(item => !item.hasOwnProperty("typeIndex"));
          let conditions = urlParams.filters.condition.conditions.filter(item => item.hasOwnProperty("typeIndex"));
          let result = conditions.reduce((initArray, item, xindex, array) => {
            let fIndex = initArray.findIndex(it => it.conditions[0].typeIndex === item.typeIndex);
            if (fIndex !== -1) {
              initArray[fIndex].conditions.push(item)
            } else {
              initArray.push({
                operator: "OR",
                conditions: [item]
              })
            }
            return initArray
          }, []);
          if (result.length) {
            result.forEach(item => {
              item.conditions.forEach(it => {
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
          pageInfo
        }) => {
          this.clearKeyWord();
          let searchHistoryData = uni.getStorageSync("searchHistoryData") ? JSON.parse(uni.getStorageSync(
            "searchHistoryData")) : [];
          console.log("keyword *****************", this.keyword);
          console.log("searchHistoryData **************", searchHistoryData)
          const index = searchHistoryData.findIndex(item => item.name == this.keyword.name);
          if (index !== -1) {
            searchHistoryData.unshift(searchHistoryData.splice(index, 1)[0])
          } else {
            searchHistoryData.unshift({
              name: this.keyword.name,
              search_value: this.keyword.name
            });
          }
          if (!this.keyword.search_type) {
            uni.setStorageSync("searchHistoryData", JSON.stringify(searchHistoryData));
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
      searchClick(keyword, refreshFlag) {
        this.keyword = keyword;
        if (keyword.search_type === 'category') {
          this.$set(this.params.filters, "categories", keyword.search_value);
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
            operator: "AND",
            conditions: [],
          };
          this.filterKeyWord = "";
          this.clearSelect();
        }
        this.getProduct();
      },
      updateList(type, sort) {
        if (type == 1) {
          this.$set(this.params, "sort", sort);
        } else {
          if (sort) {
            this.params.filters.condition.conditions.unshift({
              key: "hasInventory",
              value: "true",
              fqRule: "EQ",
            })
          } else {
            let index = this.params.filters.condition.conditions.findIndex(item => item.key == "hasInventory");
            this.params.filters.condition.conditions.splice(index, 1);
          }
        }
        this.params.pageInput.after && delete this.params.pageInput.after;
        this.updateFlag = true;
        this.getProduct();
      },
      goFilter() {
        if (this.params.pageInput.after) delete this.params.pageInput.after;
        uni.navigateTo({
          url: `/subPackages/goodsFilter/pages/index?params=${encodeURIComponent(JSON.stringify(this.params))}&type=2&resNum=${this.totalCount}`
        })
      },
      scrollToTop() {
        uni.pageScrollTo({
          scrollTop: 0
        })
      },
      delHistoryWords() {
        uni.removeStorageSync("searchHistoryData");
        this.historyWords = [];
      },

      // 获取HOT热词
      async getHelpList() {
        try {
          const res = await getHelpList({
            templateCode: 'hot',
            contentCode: 'hot',
          });
          const cmsContent = JSON.parse(get(res, 'data.shop.cmsContent', null)) || {};
          console.log('搜索页面 ===>', cmsContent);
          const helpList = get(cmsContent, 'content.zh_CN.hot.modelContents', [])
            .map((v) => ({
              search_type: v.groupContents.hot1[0].fieldContents.search_type,
              search_value: v.groupContents.hot1[0].fieldContents.search_value,
              name: v.groupContents.hot1[0].fieldContents.show,
            }))
          this.hotWords = helpList;
          console.log('hotWords', this.hotWords);
        } catch (error) {
          console.error(error)
        }
      },
    },
  }
</script>
