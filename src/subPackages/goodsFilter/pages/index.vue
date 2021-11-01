<template>
  <view class="filter-box" :style="{'padding-top':ktxStatusHeight}">
    <custom-nav-bar left-arrow="left" :left-border="false" :head-border="false" :head-font-color="false" title="筛选" />
    <view>
      <view class="filter-con">
        <view class="filter-type" @click="colorProperty.toggle = !colorProperty.toggle">
          <text class="title">颜色</text>
          <image class="filter-opt" :src="colorProperty.toggle ? 'https://res-tasaki.baozun.com/static/images/icon-reduce.png' : 'https://res-tasaki.baozun.com/static/images/icon-add.png'" mode="aspectFit">
          </image>
        </view>
        <view class="filter-check" :style="colorProperty.toggle?'display:flex;':'display:none;'">
          <view :class="['item',item.checked?'check-item':'']" v-for="(item,index) in colorProperty.values" :key="index" @click="checkedOption('colorProperty',1,item.frontName,index,'colorProperty')">
            <view class="color-box">
              <view class="color" :style="{background:item.key}"></view>
              <text class="title">{{item.value}}</text>
            </view>
            <text class="icon-font icon-gouxuanchenggong" v-if="item.checked"></text>
          </view>
        </view>
      </view>
      <view class="filter-con">
        <view class="filter-type" @click="sizeProperty.toggle = !sizeProperty.toggle">
          <text class="title">尺寸</text>
          <image class="filter-opt" :src="sizeProperty.toggle ? 'https://res-tasaki.baozun.com/static/images/icon-reduce.png' : 'https://res-tasaki.baozun.com/static/images/icon-add.png'" mode="aspectFit">
          </image>
        </view>
        <view class="filter-check" :style="sizeProperty.toggle?'display:flex;':'display:none;'">
          <view :class="['item',item.checked?'check-item':'']" v-for="(item,index) in sizeProperty.values" :key="index" @click="checkedOption('sizeProperty',2,item.frontName,index,'sizeProperty')">
            <text class="title">{{item.value}}</text>
            <text class="icon-font icon-gouxuanchenggong" v-if="item.checked"></text>
          </view>
        </view>
      </view>
      <view class="filter-con">
        <view class="filter-type" @click="materialProperty.toggle = !materialProperty.toggle">
          <text class="title">材质</text>
          <image class="filter-opt" :src="materialProperty.toggle ? 'https://res-tasaki.baozun.com/static/images/icon-reduce.png' : 'https://res-tasaki.baozun.com/static/images/icon-add.png'" mode="aspectFit">
          </image>
        </view>
        <view class="filter-check" :style="materialProperty.toggle?'display:flex;':'display:none;'">
          <view :class="['item',item.checked?'check-item':'']" v-for="(item,index) in materialProperty.values" :key="index" @click="checkedOption('materialProperty',3,item.frontName,index,'materialProperty')">
            <text class="title">{{item.value}}</text>
            <text class="icon-font icon-gouxuanchenggong" v-if="item.checked"></text>
          </view>
        </view>
      </view>
    </view>
    <view class="btn-box">
      <view class="content">
        <view class="btn" @click="resetClick">重置</view>
        <view :class="['btn',resNum==0?'bg-2':'bg-1']" @click="filterClick">筛选商品({{resNum}})</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { debounce, get } from '@/utils/utilityOperationHelper';

export default {
  data () {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      plp_params: {},
      filter_params: {},
      goodsList: [],
      colorProperty: {},
      sizeProperty: {},
      materialProperty: {},
      type: '',
      resNum: 0,
      setOptionFlag: 0,
      plpUrlParams: {},
      pageInfo: {},
      returnFlag: false,
      remark: '',
    }
  },
  computed: {
    ...mapGetters('goodsFilter', ['fromTypeData1', 'fromTypeData2']),
  },
  onLoad (option) {
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
        if (this.fromTypeData1) {
          this.colorProperty = this.fromTypeData1.colorProperty;
          this.sizeProperty = this.fromTypeData1.sizeProperty;
          this.materialProperty = this.fromTypeData1.materialProperty;
          return;
        }
      } else if (this.fromTypeData2) {
        this.colorProperty = this.fromTypeData2.colorProperty;
        this.sizeProperty = this.fromTypeData1.sizeProperty;
        this.materialProperty = this.fromTypeData1.materialProperty;
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
        const colorProperty = res.attributes.find((item) => item.code == 'basecolor') || {};
        const sizeProperty = res.attributes.find((item) => item.code == 'customSize') || {};
        const materialProperty = res.attributes.find((item) => item.code == 'material') || {};
        colorProperty.toggle = false;
        sizeProperty.toggle = false;
        materialProperty.toggle = false;
        this.colorProperty = colorProperty;
        this.sizeProperty = sizeProperty;
        this.materialProperty = materialProperty;
      }
    });
  },
  onPullDownRefresh () {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  methods: {
    get,
    ...mapActions('goodsFilter', ['getFilterData']),
    ...mapActions('search', ['searchProduct']),
    ...mapMutations('goodsFilter', ['setFilterData']),
    checkedOption (type, typeIndex, val, index, key, pidx) {
      const pIndex = this.plp_params.filters.condition.conditions.findIndex((item) => item.value
        == val);
      const item = this[type].values[index]

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
    getProduct: debounce(function (setPageData) {
      this.setOptionFlag = 1;
      const urlParams = JSON.parse(JSON.stringify(this.plp_params));
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
    resetClick () {
      this.colorProperty.values.forEach((item) => {
        item.checked = false
      });
      this.sizeProperty.values.forEach((item) => {
        item.checked = false
      });
      this.materialProperty.values.forEach((item) => {
        item.checked = false
      });
      this.plp_params.filters.condition.conditions = [];
      this.getProduct();
    },
    filterClick () {
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
    setPageData () {
      const aData = {
        colorProperty: this.colorProperty,
        sizeProperty: this.sizeProperty,
        materialProperty: this.materialProperty,
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
@import '@/styles/utilities.scss';
.filter-box {
  overflow: hidden;
  padding-bottom: var(--safe-area-inset-bottom);
  background-color: #fff;
}
.filter-con {
  padding: rpx(20) rpx(16) rpx(22);
  border-bottom: rpx(1) solid #f7f7f7;
}
.filter-type {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: rpx(16);
    font-weight: 500;
    line-height: rpx(22);
    text-align: center;
    letter-spacing: 2px;
    color: #1d1d1d;
  }
  .filter-opt {
    width: rpx(14);
    height: rpx(14);
  }
}
.filter-check {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: rpx(5);
  padding-bottom: rpx(8);
  .item {
    position: relative;
    width: rpx(165);
    margin-top: rpx(16);
    padding: rpx(10) 0;
    text-align: center;
    border: rpx(1) solid #bbb;
    .title {
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: rpx(14);
      font-weight: 400;
      letter-spacing: 2px;
      color: #1d1d1d;
    }
    .icon-font {
      font-size: rpx(12);
      position: absolute;
      top: rpx(10);
      right: rpx(21);
      color: #1d1d1d;
    }
    .color-box {
      display: flex;
      align-items: center;
      flex-direction: row;
      margin-left: rpx(15);
      .color {
        width: rpx(19);
        height: rpx(19);
        margin-right: rpx(16);
        border: rpx(1) solid #bbb;
        border-radius: 50%;
      }
    }
  }
  .check-item {
    border-color: #1d1d1d;
    .title {
      font-family: PingFangSC, PingFangSC-Medium;
    }
  }
}
.btn-box {
  position: fixed;
  z-index: 99;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: var(--safe-area-inset-bottom);
  border-top: rpx(1) solid #f7f7f7;
  background-color: #fff;
  .content {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding: rpx(12) rpx(15);
    .btn {
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: rpx(14);
      font-weight: 400;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      width: rpx(165);
      height: rpx(40);
      color: #1d1d1d;
      border: rpx(2) solid #1d1d1d;
    }
    .bg-1 {
      color: #fff;
      background: #1d1d1d;
    }
    .bg-2 {
      color: #fff;
      border-color: #bbb;
      background: #bbb;
    }
  }
}

</style>
