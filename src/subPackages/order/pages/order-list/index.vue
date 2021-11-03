<template>
  <view class="my-order" :style="{'padding-top':ktxStatusHeight}">
    <!-- header -->
    <custom-nav-bar title="我的订单" :has-left-radius="true"/>
    <!-- content -->
    <view class="my-order-content">
      <!-- 无订单 -->
      <block v-if="isLoad && !allStatusHasOrders">
        <view class="no-order" >
          <text class="icon-font icon-logo-alaia_000 logo"></text>
          <view class="no-order-text">暂无订单记录</view>
          <view class="no-order-tip">未查询到订单记录，快下单喜欢的商品吧</view>
          <customButton :btnWidth="280" :btnHeight="80" className="big-btn" @click="handleClick">去逛逛</customButton>
        </view>
      </block>
      <!-- 有订单 -->
      <block v-if="allStatusHasOrders">
        <view class="order-status-tab">
          <text @click="changeTab(item.name)" :class="item.checked?'act':''" v-for="(item,index) in tabList"
            :key="index">{{item.name}}</text>
        </view>
        <view class="order-list" v-if="isLoad && orderList.length > 0">
          <order-card
          v-for="(orderItem,orderIndex) in orderList"
          :key="orderIndex"
          :orderData="orderItem"
          :orderStatus="orderItem.node.orderStatus"
          @updateList="getOrderData">
          </order-card>
        </view>
        <view class="no-order-txt" v-if="isLoad && orderList.length == 0">暂无{{ tabName }}订单</view>
      </block>
    </view>
  </view>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import customButton from '@/components/al-button/normal';
import { SCREEN_NAME, trackerCommonPageView } from '@/utils/ga'
import { formatDateNew } from '@/utils/utils'
import orderCard from '../../components/order-card/order-card';
import { ORDER_STAUTS_TXT_MAPPING, ORDER_STATUS_TXT } from '@/constants/order';
import { isAllOrderStatus } from '@/utils/order';

export default {
  name: 'order',
  components: {
    customButton,
    orderCard,
  },
  data() {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      orderList: [],
      isLoad: false,
      pageInfo: {},
      tabList: ORDER_STATUS_TXT.map((name, i) => ({ name, checked: i === 0 })),
      orderStatuses: [],
      tabName: '全部',
      allStatusHasOrders: false
    }
  },
  computed: {
    ...mapGetters('order', ['orderPageInfo']),
  },
  onShow() {
    this.getOrderData({}, true)
    trackerCommonPageView(SCREEN_NAME.ORDER)
  },
  onReachBottom() {
    if (this.orderPageInfo.hasNextPage) {
      this.getOrderData({ 
        after: this.orderPageInfo.endCursor, 
        orderStatuses: this.orderStatuses 
      })
    }
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  methods: {
    ...mapActions('order', ['getOrderList']),
    ...mapMutations('globle', ['setTabSelected']),
    formatDateNew,
    // 切换状态
    changeTab(name) {
        this.tabList.forEach(t => t.checked = false);
        this.orderStatuses = ORDER_STAUTS_TXT_MAPPING[name];
        this.orderList = [];
        this.tabName = name;
        this.getOrderData({ orderStatuses: this.orderStatuses }, isAllOrderStatus(this.orderStatuses));
        const item = this.tabList.find(t => t.name === name);
        this.$set(item, 'checked', true);
    },
    // 点击去逛逛，去首页
    handleClick() {
      this.setTabSelected(0);
      uni.switchTab({ url: '/pages/index/index' })
    },
    // 获取订单数据
    getOrderData(params, isAllOrderStatus) {
      this.isLoad = false
      uni.showLoading({ title: '加载中...' });
      this.getOrderList(params).then((res) => {
        uni.hideLoading();
        this.isLoad = true
        let list;
        if(params){
          list = [...this.orderList, ...res.edges]
        }else{
          list = res.edges
        }
        this.pageInfo = res.pageInfo
        this.orderList = list.map((item) => ({
          ...item,
          totalQuantity: item.node.orderLines.reduce((total, v) => total + v.quantity, 0),
          orderTime: item.node.orderTime.substring(0, 19),
        }))

        if (isAllOrderStatus) {
            this.allStatusHasOrders = this.orderList.length > 0
        }
      }).catch((e) => {
        this.isLoad = true
        uni.hideLoading();
        console.log('查询订单列表失败', e)
      })
    },
    handleFailed() {
      this.orderList = []
      this.getOrderData()
    }
  },
}
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
