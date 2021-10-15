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
              <view>订单金额：{{ get(orderInfo, 'node.amount.amount') | currency }}</view>
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
</template>
<script>
import customButton from '@/components/al-button/normal';
import { mapActions } from 'vuex';
import { get } from '@/utils/utilityOperationHelper';
import { priceFormat } from '@/utils/utils';

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
    };
  },
  filters: {
    formatMoney(val) {
      if (val) {
        return priceFormat(val);
      }
      return '0';
    },
    currency(value) {
      if (!value && value !== 0) return '0';
      return utils.currency(value);
    }
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
        // console.log('watch',this.cardData)
      },
    },
  },
  onLoad() {

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
      const { orderData } = this;
      const that = this;
      if (that.cardData.node.orderStatus == 'WAIT_PAY' && that.cardData.node.paySurplusTime > 0) {
        that.countDownInterval = setInterval(() => {
          if (that.cardData.countDownTime == '0') {
            console.log('倒计时0')
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
            // that.srTrackOrder('cancel_give_order', trackData)
            that.$emit('updateList')
            clearInterval(that.countDownInterval); // 清除定时器
          } else {
            const time = that.cardData.node.paySurplusTime--
            that.cardData.countDownTime = that.countDownFun(time);
            that.$set(
              that.cardData,
              that.cardData.countDownTime,
              that.countDownFun(time),
            )
          }
        }, 1000);
      }
    },
    // 支付剩余时间倒计时
    // 倒计时
    countDownFun(time) {
      const result = time;
      const d = parseInt(result / (24 * 60 * 60)); // 用总共的秒数除以1天的秒数
      let h = parseInt((result / (60 * 60)) % 24); // 精确小时，用去余
      const m = parseInt((result / 60) % 60); // 剩余分钟就是用1小时等于60分钟进行趣余
      let s = parseInt(result % 60);
      // 当倒计时结束时，改变内容
      if (result <= 0) {
        return '0';
      }
      if (h < 10) {
        h = `0${h}`;
      }
      if (s < 10) {
        s = `0${s}`;
      }
      if (h == 0 && m == 0) {
        return `${s}s`;
      } if (h == 0) {
        return `${m}:${s}`;
      } if (d == 0) {
        return `${h}:${m}:${s}`;
      }
      return `${d}:${h}:${m}:${s}`;
    },
    // 去详情页
    goOrderDetail(orderData) {
      const { orderCode } = orderData.node
      // this.srTrackList(orderData)
      uni.navigateTo({
        url: `/subPackages/order/pages/order-detail/index?orderCode=${orderCode}`,
      })
    },
    // 去支付
    goPay(orderData) {
      // console.log('orderData',orderData)
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
