  <!-- 首页产品轮播 -->
<template name="orderCard">
  <view class="order-card">
    <view class="order-card-content">
          <view class="order-info-box">
            <view class="order-card-header">
              <view class="order-num">订单编号：<text :userSelect="true">{{orderData.node.orderCode}}</text></view>
              <view class="order-time">下单时间：{{orderData.orderTime}}</view>
              <view class="order-status" v-if="orderData.node.orderStatus == 'WAIT_DELIVERY'">待发货</view>
              <view class="order-status important" v-else-if="orderData.node.orderStatus == 'WAIT_PAY'">待支付</view>
              <view class="order-status" v-else-if="orderData.node.orderStatus == 'WAIT_RECEIVE'">待收货</view>
              <view class="order-status" v-else-if="orderData.node.orderStatus == 'WAIT_EVALUATE'">已发货</view>
              <view class="order-status" v-else-if="orderData.node.orderStatus == 'COMPLETED'">已完成</view>
              <view class="order-status" v-else-if="orderData.node.orderStatus == 'CANCELED'">已取消</view>
              <view class="order-status" v-else-if="orderData.node.orderStatus == 'AUTO_CANCEL'">自动取消</view>
              <view v-else>其它</view>
            </view>
            <view>
              <view class="img-box" v-if="orderData.node.orderLines">
                  <template v-for="(item, index) in orderData.node.orderLines" >
                    <image :key="index" class="p-image" :src="item.image" mode="aspectFill" />
                  </template>
              </view>
              <view class="order-info">
                <view>
                  <view class="p-amount">商品数量：{{orderData.totalQuantity}}</view>
                  <view>订单金额：{{ orderData.node.amount.amount | currency }}</view>
                </view>
                <view class="action">
                  <customButton :btnWidth="180" className="transparent" @click="goOrderDetail(orderData)">查看详情</customButton>
                  <customButton v-if="orderData.node.orderStatus == 'WAIT_PAY'" style="margin-left: 20rpx" @click="goPay(orderData)" :btnWidth="180" className="big-btn">立即支付</customButton>
                <view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import customButton from '@/components/al-button/normal';
import { mapActions } from 'vuex';
import { get } from '@/utils/utilityOperationHelper';
import { currency } from '@/filters';  

export default {
  name: 'orderCard',
  components: {
    customButton,
  },
  props: {
    orderData: {
      type: Object,
      value: {},
    },
    orderStatus: {
      type: String,
    },
  },
  data() {
    return {
      countDownInterval: null,
      cardData: {},
      cardOrderStatus: '',
      paySurplusTime: 0
    };
  },
  filters: {
    currency
  },
  watch: {
    orderStatus: {
      deep: true,
      immediate: true,
      handler(n, o) {
        this.cardOrderStatus = n;
        console.log('cardOrderStatus', this.cardOrderStatus)
      },
    },
    orderData: {
      deep: true,
      immediate: true,
      handler(n, o) {
        this.cardData = n;
      },
    },
  },
  created() {
    this.cardData = this.orderData
    this.cardOrderStatus = this.orderStatus
    this.loopCountDown()
  },
  methods: {
    ...mapActions('order', ['orderPay']),
    // 倒计时
    loopCountDown() {
      this.paySurplusTime = this.cardData.node.paySurplusTime;
      if (this.cardData.node.orderStatus == 'WAIT_PAY' && this.paySurplusTime > 0) {
        that.countDownInterval = setInterval(() => {
          if (this.paySurplusTime == 0) {
            that.$emit('updateList', { orderStatuses: [ 'WAIT_PAY' ] })
            clearInterval(that.countDownInterval); // 清除定时器
          } else {
            this.paySurplusTime--
          }
        }, 1000);
      }
    },
    // 去详情页
    goOrderDetail(orderData) {
      const { orderCode } = orderData.node
      uni.navigateTo({
        url: `/subPackages/order/pages/order-detail/index?orderCode=${orderCode}`,
      })
    },
    // 去支付
    goPay(orderData) {
      const orderNo = orderData.node.orderCode
      const orderInfo = orderData.node
      const amount = get(orderInfo, 'amount.amount')
      const orderTime = new Date(get(orderInfo, 'orderTime').replace(/\-/g, '/')).getTime()
      const trackData = {
        order: {
          order_id: orderNo,
          order_time: orderTime,
        },
        sub_orders: [{
          sub_order_id: orderNo,
          order_amt: amount,
          pay_amt: amount,
        }],
      }
      console.log('trackData', trackData)
      this.srTrackOrder('pay', trackData)
      this.orderPay({ orderNo }).then(() => {
        uni.redirectTo({
          url: `/subPackages/payResult/pages/index?orderId=${orderNo}&isSuccess=yes`,
        })
      }).catch((error) => {
        this.srTrackOrder('cancel_pay', trackData)
        uni.showToast({
          title: error.message,
          icon: 'none',
        })
        console.log(error)
        // Do nothing
      })
    },
    // 有数支付埋点
    srTrackOrder(orderStatus, params) {
      params.order.order_status = orderStatus
      console.log('有数params', params)
      this.$sr.track('custom_order', params)
    },
    // 有数商品卡触发埋点
    srTrackList(params) {
      const orderInfo = params.node
      this.$sr.track('trigger_sku_component',
        {
          sku: {
            sku_id: orderInfo.orderCode, // 若商品无sku_id时，可传spu_id信息
            sku_name: orderInfo.orderLines[0].name, // 若商品无sku_name时，可传spu_name信息
          },
          spu: {
            spu_id: orderInfo.orderCode, // 若商品无spu_id时，可传sku_id信息
            spu_name: orderInfo.orderLines[0].name, // 若商品无spu_name时，可传sku_name信息
          },
          primary_image_url: orderInfo.orderLines[0].image,
        })
    },
  },
};
</script>

<style lang="scss" scoped>
  @import './index';

</style>
