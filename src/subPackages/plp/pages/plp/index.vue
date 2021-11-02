<template>
  <view>
    <custom-nav-bar left-arrow="left" :has-left-radius="true" :head-border=" scrollHeight>168?false:isHeadBorder" :head-blank="scrollHeight>168?false:isHeadBlank" title=" " />
    <view :style="{ 'padding-top': ktxStatusHeight }" v-if="!menuData.picLink||goodsList.length==0"></view>
    <block v-if="pageShow">
      <search-res v-if="totalCount" :totalCount="totalCount" :keyWord="keyWord" :remark="remark" :filterKeyWord="filterKeyWord" :img="img" :goodsList="goodsList" :menuList="menuData" @selectMenu="selectMenu" @on-favorite="cutFavorite" @updateList="updateList" @goFilter="goFilter" @scrollToTop="scrollToTop" :goTopFlag="goTopFlag" :isStatic="isStatic" />
      <search-no-res v-else :keyWord="keyWord" :totalCount="totalCount" />
    </block>
  </view>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { delFavoriteApi, createFavoriteApi } from '@/service/apis/user';
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
      // 是否会员
      isMemberLogin: false,
      // 是否授权过用户信息
      isAuthorizeInfo: false,
      keyWord: '',
      filterKeyWord: '',
      goodsList: [],
      menuData: {},
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
      scrollHeight: 0,
      isStatic: true,
    };
  },
  onLoad (option) {
    wx.hideShareMenu();
    // 三级导航
    this.getCategoryData().then((result) => {
      for (const [key, value] of Object.entries(result)) {
        if (value.name === '分类') {
          const pageData = value ? value.children : []
          pageData && pageData.forEach((element) => {
            if (element.url == option.code) {
              this.menuData = element
              this.selectMenu(element)
            } else {
              element.children && element.children.forEach((e) => {
                if (e.url == option.code) {
                  this.menuData = element
                  this.selectMenu(e)
                }
              });
            }
          });
        }
      }
    })
  },
  onShow () {
    this.isMemberLogin = uni.getStorageSync('isMemberLogin') || false;
    this.isAuthorizeInfo = uni.getStorageSync('isAuthorizeInfo') || false;
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
          const keyWordString = [];
          newData.filters.condition.conditions.forEach((item) => {
            if (item.hasOwnProperty('typeIndex')) {
              if (item.value != this.keyWord) {
                keyWordString.push(item.value)
              }
            }
          });
          if (keyWordString) {
            this.filterKeyWord = keyWordString.join('、');
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
  onPullDownRefresh () {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  onPageScroll (e) {
    if (e.scrollTop > 1000) {
      this.goTopFlag = true;
    } else {
      this.goTopFlag = false;
    }

    // 判断浏览器滚动条上下滚动
    if (e.scrollTop > this.scrollTop || e.scrollTop >= this.scrollHeight) {
      this.isStatic = false
    } else {
      this.isStatic = true
    }
    // 给scrollTop重新赋值
    this.scrollHeight = e.scrollTop
    // 页面滚动结束
    const timer = setTimeout(() => {
      if (this.scrollHeight === e.scrollTop) {
        this.isStatic = true
        clearTimeout(timer)
      }
    }, 10000)
  },
  onShareAppMessage (res) {
    return {
      title: 'ALAIA线上旗舰店',
      path: `/subPackages/plp/pages/plp/index?name=${this.keyWord}&code=${this.params.filters.categories}`,
    };
  },
  methods: {
    ...mapMutations('goodsFilter', ['clearFilterData']),
    ...mapActions('search', ['searchProduct']),
    ...mapActions('category', ['getCategoryData']),
    selectMenu (e) {
      let key = e
      const list = this.menuData
      if (list.children) {
        list.children.forEach((item) => {
          item.select = false
          if (item.url == e.url) {
            item.select = true
            key = item
          }
        });
      }
      this.params.filters.categories = (['', 'null', 'undefined', null, undefined].includes(key.url)) ? '' : key.url
      this.keyWord = (['', 'null', 'undefined', null, undefined].includes(key.name)) ? '' : key.name
      this.goodsList = []
      this.getProduct();
      this.menuData = list
    },
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
        if (this.totalCount) {
          if (this.updateFlag) {
            this.updateFlag = false;
            this.goodsList = list
          } else {
            this.goodsList = this.goodsList.concat(list || []);
          }
          for (let i = 1; i < this.goodsList.length; i += 4) {
            this.goodsList[i].hasBorder = true;
            if (this.goodsList[i + 1]) {
              this.goodsList[i + 1].hasBorder = true;
            }
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
    async cutFavorite (e) {
      const list = this.goodsList
      const item = list[e]
      const isBloon = item.favorite ? item.favorite.id ? item.favorite.id : false : false

      const Member = this.isMemberLogin && this.isAuthorizeInfo
      if (Member) {
        if (isBloon) {
          const result = await delFavoriteApi({ input: [item.favorite.id] })
          item.favorite = {
            id: null,
          }
          if (!result.data.createFavorite) {
            uni.showToast({
              icon: 'none',
              title: '取消成功',
              duration: 2000,
            });
          }
        } else {
          const covers = []
          item.images.forEach((e) => {
            if (e.type == 'MAINIMAGE') {
              covers.push(e.url)
            }
          });
          if (covers.length) {
            const input = {
              spuCode: item.code,
              price: item.salePrice,
              url: covers[0],
            }
            const result = await createFavoriteApi({ ...input })
            item.favorite = {
              id: result.data.createFavorite,
            }
            if (result.data.createFavorite) {
              uni.showToast({
                icon: 'none',
                title: '收藏成功',
                duration: 2000,
              });
            }
          }
        }
        this.goodsList.splice(e, 1, item)
      } else {
        uni.navigateTo({
          url: '/subPackages/login/pages/login/index',
        });
      }
    },
  },
};
</script>
