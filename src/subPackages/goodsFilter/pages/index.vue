<template>
  <view class="filter-box" :style="{'padding-top':ktxStatusHeight}">
    <custom-nav-bar left-arrow="left" />
    <view>
      <text class="filter-title">商品筛选</text>
      <view class="filter-con">
        <view class="filter-type" @click="category.toggle = !category.toggle">
          <text>类别</text>
          <image class="filter-opt"
            :src="category.toggle ? 'https://res-tasaki.baozun.com/static/images/icon-reduce.png' : 'https://res-tasaki.baozun.com/static/images/icon-add.png'"
            mode="aspectFit">
          </image>
        </view>
        <view class="filter-check" :style="category.toggle?'display:flex;':'display:none;'">
          <view class="filter-check-item" v-for="(item,index) in category.values" :key="index"
            @click="checkedOption('category',1,item.frontName,index,'Category')">
            <view class="filter-check-icon" :class="item.checked?'filter-icon-act':''"></view>
            <text :class="item.checked?'filter-font-act':''">{{item.key}}</text>
          </view>
        </view>
      </view>
      <view class="filter-con" style="padding: 0;" v-if="collection1.values && collection1.values.length">
        <text class="collection-name">系列</text>
        <view class="collection-item" v-for="(item,index) in collection1.values" :key="index">
          <view class="filter-type" @click="getCollection2(index,item.frontName)">
            <text>{{item.key}}</text>
            <image class="filter-opt"
              :src="item.toggle ? 'https://res-tasaki.baozun.com/static/images/icon-reduce.png' : 'https://res-tasaki.baozun.com/static/images/icon-add.png'"
              mode="aspectFit">
            </image>
          </view>
          <view class="filter-check" v-if="item.toggle && item.hasOwnProperty('collection2')" style="display:flex;">
            <view class="filter-check-item" v-for="(it,idx) in item.collection2.values" :key="idx"
              @click="checkedOption('collection2',2,it.frontName,idx,'Collection2',index)">
              <view class="filter-check-icon" :class="it.checked?'filter-icon-act':''"></view>
              <text :class="it.checked?'filter-font-act':''">{{it.key}}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="filter-con">
        <view class="filter-type" @click="metallicProperty.toggle = !metallicProperty.toggle">
          <text>材质</text>
          <image class="filter-opt"
            :src="metallicProperty.toggle ? 'https://res-tasaki.baozun.com/static/images/icon-reduce.png' : 'https://res-tasaki.baozun.com/static/images/icon-add.png'"
            mode="aspectFit">
          </image>
        </view>
        <view class="filter-check" :style="metallicProperty.toggle?'display:flex;':'display:none;'">
          <view class="filter-check-item" v-for="(item,index) in metallicProperty.values" :key="index"
            @click="checkedOption('metallicProperty',3,item.frontName,index,'MetallicProperty')">
            <view class="filter-check-icon" :class="item.checked?'filter-icon-act':''"></view>
            <text :class="item.checked?'filter-font-act':''">{{item.key}}</text>
          </view>
        </view>
      </view>
      <view class="filter-price" v-if="refresh">
        <text class="price-font">价格</text>
        <RangeSlider :width="slideWidth" :height="slideHeight" :blockSize="slideBlockSize" :min="slideMin"
          :max="slideMax" :values="rangeValues" :backgroundColor="bgColor" :activeColor="actColor" :step="step"
          :liveMode="isLiveMode" @rangechange="onRangeChange">
        </RangeSlider>
        <text class="price-val">￥{{rangeValues[0]}} - ￥{{rangeValues[1]}}</text>
      </view>
    </view>
    <view class="btn-box">
      <view class="btn">
        <customButton :btnWidth="330" :btnHeight="80" className="transparent" @click="resetClick">
          重置
        </customButton>
        <customButton :btnWidth="330" :btnHeight="80" className="big-btn" @click="filterClick">
          确认({{resNum}}件作品)
        </customButton>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapGetters,
    mapActions,
  } from 'vuex';
  import customButton from '@/components/button/normal.vue';
  import {
    debounce,
    get,
  } from '@/utils/utilityOperationHelper';
  import RangeSlider from '../../../components/range-slider/range-slider.vue';

  export default {
    components: {
      RangeSlider,
      customButton,
    },
    data() {
      return {
        ktxStatusHeight: getApp().globalData.ktxStatusHeight,
        rangeValues: [0, 50000],
        slideWidth: 650,
        slideHeight: 80,
        slideBlockSize: 50,
        slideMin: 0,
        slideMax: 50000,
        isLiveMode: true,
        step: 1,
        bgColor: '#F0F2F4',
        actColor: '#616568',
        plp_params: {},
        filter_params: {},
        goodsList: [],
        category: {},
        collection1: {},
        metallicProperty: {},
        type: '',
        resNum: 0,
        setOptionFlag: 0,
        plpUrlParams: {},
        pageInfo: {},
        returnFlag: false,
        remark: '',
        refresh: true,
      }
    },
    computed: {
      ...mapGetters('goodsFilter', ['fromTypeData1', 'fromTypeData2']),
    },
    onLoad(option) {
      const type = option.type || '';
      const params = JSON.parse(decodeURIComponent(option.params)) || {};
      if (!params.filters.hasOwnProperty('condition')) {
        params.filters.condition = {
          operator: 'AND',
          conditions: [],
        }
      }
      this.resNum = option.resNum || 0;
      this.plp_params = JSON.parse(JSON.stringify(params));
      this.filter_params = JSON.parse(JSON.stringify(params));
      this.filter_params.sort = {};
      this.type = type
      this.remark = option.remark || ''
      if (params.filters.condition.conditions.length) {
        if (type == 1) {
          if (this.fromTypeData1 && this.fromTypeData1.category && Object.keys(this.fromTypeData1.category).length >
            0) {
            this.category = this.fromTypeData1.category;
            this.collection1 = this.fromTypeData1.collection1;
            this.metallicProperty = this.fromTypeData1.metallicProperty;
            this.rangeValues = this.fromTypeData1.rangeValues;
            return;
          }
        } else if (this.fromTypeData2 && this.fromTypeData2.category && Object.keys(this.fromTypeData2.category)
          .length > 0) {
          this.category = this.fromTypeData2.category;
          this.collection1 = this.fromTypeData2.collection1;
          this.metallicProperty = this.fromTypeData2.metallicProperty;
          this.rangeValues = this.fromTypeData2.rangeValues;
          return;
        }
      }
      const urlParams = JSON.parse(JSON.stringify(this.filter_params));
      if (urlParams.filters.condition.conditions.length) {
        urlParams.filters.condition.conditions.forEach((item) => {
          urlParams.filters.condition.conditions = [{
            operator: 'OR',
            conditions: [item],
          }]
        })
      } else {
        delete urlParams.filters.condition
      }
      this.getFilterData(urlParams).then((res) => {
        if (res.attributes) {
          const category = res.attributes.find((item) => item.code == 'Category') || {};
          const collection1 = res.attributes.find((item) => item.code == 'Collection1') || {};
          const metallicProperty = res.attributes.find((item) => item.code == 'MetallicProperty') || {};
          category.toggle = true;
          metallicProperty.toggle = false;
          if (collection1.values) {
            collection1.values.forEach((item) => {
              item.toggle = false;
            })
          }
          // 只显示remark的分类
          if (this.remark) {
            const categoryList = get(category, 'values').filter((i) => i.key === this.remark)
            category.values = categoryList
          }
          this.category = category;
          this.collection1 = collection1;
          this.metallicProperty = metallicProperty;
        }
      });
    },
    onPullDownRefresh() {
      wx.stopPullDownRefresh(); // 阻止下拉刷新
    },
    methods: {
      get,
      ...mapActions('goodsFilter', ['getFilterData']),
      ...mapActions('search', ['searchProduct']),
      ...mapMutations('goodsFilter', ['setFilterData']),
      checkedOption(type, typeIndex, val, index, key, pidx) {
        const pIndex = this.plp_params.filters.condition.conditions.findIndex((item) => item.value ==
          val);
        const item = type == 'collection2' ? this.collection1.values[pidx].collection2.values[index] : this[type]
          .values[
            index]
        if (item.checked) {
          this.plp_params.filters.condition.conditions.splice(pIndex, 1);
        } else if (pIndex === -1) {
          this.plp_params.filters.condition.conditions.push({
            key: 'attrList.valueCode',
            value: val,
            fqRule: 'EQ',
            typeIndex,
          });
        }
        this.getProduct();
        this.$set(item, 'checked', !item.checked);
      },
      getCollection2(index, val) {
        /* 为了满足当前需求（点一个父系列把其他父系列都隐藏并且清空子系列）才有这部分代码逻辑 =》start */
        if (this.collection1.values[index].hasOwnProperty('collection2')) {
          if (this.collection1.values[index].collection2.values) {
            let updateFlag = false;
            this.collection1.values[index].collection2.values.forEach((item) => {
              if (item.checked) {
                const pIndex = this.plp_params.filters.condition.conditions.findIndex((it) => it.value == item
                  .frontName);
                if (pIndex !== -1) {
                  this.plp_params.filters.condition.conditions.splice(pIndex, 1);
                  updateFlag = true;
                }
              }
            });
            if (updateFlag) {
              this.getProduct();
            }
          }
        }
        /* 为了满足当前需求（点一个父系列把其他父系列都隐藏并且清空子系列）才有这部分代码逻辑 =》end */
        if (this.collection1.values[index].toggle) {
          const pIndex = this.filter_params.filters.condition.conditions.findIndex((item) => item.value == val);
          this.$set(this.collection1.values[index], 'toggle', false);
          if (this.collection1.values[index].collection2.values && this.collection1.values[index].collection2.values
            .length) {
            this.collection1.values[index].collection2.values.forEach((item) => {
              item.checked = false;
            })
          }
          this.filter_params.filters.condition.conditions.splice(pIndex, 1);
        } else {
          /* 为了满足当前需求（点一个父系列把其他父系列都隐藏并且清空子系列）才有这部分代码逻辑 =》start */
          let updateFlag = false;
          this.collection1.values.forEach((item) => {
            item.toggle = false;
            if (item.collection2 && Array.isArray(item.collection2.values) && item.collection2.values.length) {
              item.collection2.values.forEach((it) => {
                const pIndex = this.plp_params.filters.condition.conditions.findIndex((itd) => itd.value == it
                  .frontName);
                if (pIndex !== -1) {
                  this.plp_params.filters.condition.conditions.splice(pIndex, 1);
                  updateFlag = true;
                }
                it.checked = false;
              })
            }
          });
          if (updateFlag) {
            this.getProduct();
          }
          /* 为了满足当前需求（点一个父系列把其他父系列都隐藏并且清空子系列）才有这部分代码逻辑 =》end */
          this.$set(this.collection1.values[index], 'toggle', true);
          if (!this.collection1.values[index].hasOwnProperty('collection2')) {
            this.filter_params.filters.condition.conditions = [{
              key: 'attrList.valueCode',
              value: val,
              fqRule: 'EQ',
            }];
            const urlParams = JSON.parse(JSON.stringify(this.filter_params));
            if (urlParams.filters.condition.conditions.length) {
              urlParams.filters.condition.conditions.forEach((item) => {
                urlParams.filters.condition.conditions = [{
                  operator: 'OR',
                  conditions: [item],
                }]
              })
            } else {
              delete urlParams.filters.condition
            }
            this.getFilterData(urlParams).then((res) => {
              if (res.attributes) {
                this.$set(this.collection1.values[index], 'collection2', res.attributes.find((item) => item
                  .code ==
                  'Collection2') || {});
              }
            });
          }
        }
      },
      getProduct: debounce(function(setPageData) {
        this.setOptionFlag = 1;
        const {
          rangeValues
        } = this;
        if (rangeValues[0] == 0 && rangeValues[1] == 50000) {
          if (this.plp_params.filters.condition.conditions.length >= 2 && this.plp_params.filters.condition
            .conditions[0]
            .key == 'skuList.salePrice') {
            this.plp_params.filters.condition.conditions = this.plp_params.filters.condition.conditions.splice(2);
          }
        } else if (this.plp_params.filters.condition.conditions.length && this.plp_params.filters.condition
          .conditions[0]
          .key == 'skuList.salePrice') {
          this.$set(this.plp_params.filters.condition.conditions[0], 'value', rangeValues[1]);
          this.$set(this.plp_params.filters.condition.conditions[1], 'value', rangeValues[0]);
        } else {
          this.plp_params.filters.condition.conditions.unshift({
            key: 'skuList.salePrice',
            value: rangeValues[1],
            fqRule: 'LTE',
          }, {
            key: 'skuList.salePrice',
            value: rangeValues[0],
            fqRule: 'GT',
          });
        }
        const urlParams = JSON.parse(JSON.stringify(this.plp_params));
        if (urlParams.filters.condition.conditions.length) {
          const priceArr = urlParams.filters.condition.conditions.filter((item) => !item.hasOwnProperty(
            'typeIndex'));
          const conditions = urlParams.filters.condition.conditions.filter((item) => item.hasOwnProperty(
            'typeIndex'));
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
        this.searchProduct(urlParams).then(({
          list,
          pageInfo,
        }) => {
          this.plpUrlParams = urlParams;
          this.setOptionFlag = 2;
          if (list.length === 0) {
            uni.showToast({
              title: '暂无匹配作品，更换筛选项试试吧',
              icon: 'none',
              duration: 1000,
            })
          }
          this.goodsList = list || [];
          for (let i = 1; i < this.goodsList.length; i += 4) {
            this.goodsList[i].hasBorder = true;
            if (this.goodsList[i + 1]) {
              this.goodsList[i + 1].hasBorder = true;
            }
          }
          this.pageInfo = pageInfo;
          this.resNum = pageInfo.totalCount || 0;

          if (setPageData) {
            this.setPageData();
          }
        })
      }, 300),
      onRangeChange(e) {
        this.rangeValues = [e.minValue, e.maxValue];
        this.getProduct();
      },
      resetClick() {
        this.refresh = false
        this.$nextTick(() => {
          this.refresh = true
        })
        this.rangeValues = [0, 50000];
        this.category.values.forEach((item) => {
          item.checked = false
        });
        this.metallicProperty.values.forEach((item) => {
          item.checked = false
        });
        this.collection1.values.forEach((item) => {
          item.toggle = false;
        })
        this.plp_params.filters.condition.conditions = [];
        this.getProduct();
      },
      filterClick() {
        if (this.returnFlag) return;
        this.returnFlag = true;
        if (this.setOptionFlag) {
          if (this.setOptionFlag === 1) {
            this.getProduct('setPageData');
          } else {
            this.setPageData();
          }
        } else {
          uni.navigateBack();
        }
      },
      setPageData() {
        const aData = {
          category: this.category,
          collection1: this.collection1,
          metallicProperty: this.metallicProperty,
          rangeValues: this.rangeValues,
          goodsList: this.goodsList,
          pageInfo: this.pageInfo,
          plp_params: this.plp_params,
        };
        if (aData.pageInfo.hasNextPage) {
          aData.plp_params.pageInput.after = aData.pageInfo.endCursor
        }
        this.setFilterData({
          data: aData,
          type: this.type,
        });
        uni.navigateBack();
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "@/styles/utilities.scss";

  .filter-box {
    // width: 100%;
    // overflow-y: auto;
    // z-index: 999;
    background-color: #fff;
    padding-bottom: var(--safe-area-inset-bottom);
    overflow: hidden;
  }

  .filter-title {
    display: block;
    color: #000;
    font-size: 32upx;
    text-align: center;
    padding-top: 48upx;
  }

  .filter-con {
    width: 650upx;
    margin: 50upx auto 0;
    border-bottom: 1upx solid #e6e6e6;
    padding-bottom: 50upx;
  }

  .filter-type {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #1d1d1d;
    font-size: 30upx;
  }

  .filter-opt {
    width: 26upx;
    height: 26upx;
    margin-top: 4upx;
  }

  .filter-check {
    margin-top: 20upx;
    flex-wrap: wrap;
  }

  .filter-check-item {
    width: 50%;
    display: flex;
    align-items: center;
    color: #8e8e8e;
    font-size: 30upx;
    margin-top: 30upx;
  }

  .filter-check-icon {
    width: 30upx;
    height: 30upx;
    background-color: #fff;
    border: 2upx solid #bbb;
    margin-right: 20upx;
    border-radius: 50%;
  }

  .filter-icon-act {
    background-color: #E3F0EA !important;
    border: 2upx solid #1d1d1d !important;
  }

  .filter-font-act {
    color: #1d1d1d !important;
  }

  .btn-box {
    // width: 100%;
    // border-top: 2rpx solid #f4f4f4;
    // padding-bottom: var(--safe-area-inset-bottom);

    width: 100%;
    background-color: #fff;
    padding-bottom: var(--safe-area-inset-bottom);
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 2rpx solid #f4f4f4;
    z-index: 99;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 750upx;
    height: 128upx;
  }

  .filter-price {
    width: 650upx;
    margin: 0 auto;
    padding: 50upx 0 200upx;
  }

  .price-font {
    display: block;
    font-size: 30upx;
    color: #000;
    margin-bottom: 25upx;
  }

  .price-val {
    display: block;
    font-size: 30upx;
    color: #1d1d1d;
    margin-top: 25upx;
  }

  .collection-name {
    display: block;
    color: #1D1D1D;
    margin-bottom: 10upx;
  }

  .collection-item {
    padding: 50rpx 0;
    border-bottom: 1rpx solid #e6e6e6;
  }

  .collection-item:last-child {
    border-bottom: none;
  }

  .range-slider-block {
    position: absolute;
    top: -30rpx;
  }
</style>
