<template>
  <view class="my-order" :style="{'padding-top':ktxStatusHeight}">
    <!-- header -->
    <custom-nav-bar title="我的订单"/>
    <!-- content -->
    <view class="my-order-content">
      <!-- 无订单 -->
      <block v-if="isLoad && orderList.length == 0">
        <view class="no-order" >
          <view class="no-order-text">暂无订单记录</view>
          <view class="no-order-tip">未查询到购买记录，快下单喜欢的商品吧</view>
          <customButton :btnWidth="280" :btnHeight="80" className="big-btn" @click="handleClick">去逛逛</customButton>
        </view>
        <!-- 无订单时展示 猜你喜欢 & 最近浏览 -->
        <recently-like-products/>
      </block>
      <!-- 有订单 -->
      <block v-if="isLoad && orderList.length > 0">
        <view class="order-list">
          <order-card
          v-for="(orderItem,orderIndex) in orderList"
          :key="orderIndex"
          :orderData="orderItem"
          :orderStatus="orderItem.node.orderStatus"
          @updateList="getOrderData"
          >
        </order-card>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import customButton from '@/components/button/normal.vue';
import RecentlyLikeProducts from '@/pages/shoppingCar/components/RecentlyLikeProducts'
import { SCREEN_NAME, trackerCommonPageView } from '@/utils/ga'
import { formatDateNew } from '@/utils/utils'
import orderCard from '../../components/order-card/order-card';
export default {
  name: 'order',
  components: {
    customButton,
    orderCard,
    RecentlyLikeProducts,
  },
  data() {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      orderList: [],
      isLoad: false,
      pageInfo: {},
    }
  },
  computed: {
    ...mapGetters('order', ['orderPageInfo']),
  },
  onLoad() {

  },
  onShow() {
    this.getOrderData()
    trackerCommonPageView(SCREEN_NAME.ORDER)
  },
  onReachBottom() {
    if (this.orderPageInfo.hasNextPage) {
      this.getOrderData({ after: this.orderPageInfo.endCursor })
    }
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  methods: {
    ...mapActions('order', ['getOrderList']),
    ...mapMutations('globle', ['setTabSelected']),
    formatDateNew,
    // 点击去逛逛，去首页
    handleClick() {
      this.setTabSelected(0);
      uni.switchTab({
        url: '/pages/index/index',
      })
    },
    // 获取订单数据
    getOrderData(params) {
      this.getOrderList(params).then((res) => {
        this.isLoad = true
        console.log('params',params)
        console.log('this.orderList',this.orderList)
        console.log('res',res.edges)
        let list;
        if(params){
          // 分页
          console.log('分页')
          list = [...this.orderList, ...res.edges]
        }else{
          // 第一页
          console.log('第一页')
          list = res.edges
        }
        console.log('list',list)
        this.pageInfo = res.pageInfo
        this.orderList = list.map((item) => ({
          ...item,
          totalQuantity: item.node.orderLines.reduce((total, v) => total + v.quantity, 0),
          orderTime: item.node.orderTime.substring(0, 19),
        }))
        console.log('this.orderList',this.orderList)
      }).catch((e) => {
        this.isLoad = true
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
