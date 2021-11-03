<template>
  <view class="pay-result-container">
    <!-- 自定义页头 -->
    <custom-nav-bar :title="'支付结果'" :has-left-radius="true"/>
    <view class="container" :style="{ 'padding-top': computedHeight, 'padding-bottom': isSuccess && 0 }">
      <!-- 支付成功的文案 -->
      <view class="result-info" v-if="isSuccess">
        <text class="result-msg icon-font icon-zhifuchenggong">支付成功</text>
        <view class="result-tips success-tips">我们将尽快发货，当您收到货物时，请当面验收快递包裹后再签收。</view>
        <customButton :btnWidth="170" className="big-btn" v-if="isSuccess" @click="handleGoBackHome">去逛逛</customButton>
      </view>
      <!-- 支付失败的文案 -->
      <view class="result-info" v-else>
        <view class="result-msg">支付失败，重新支付</view>
        <view class="price">{{ get(orderInfo, 'amount.amount') | currency }}</view>
        <view class="result-tips">
          请尽快完成支付，2小时后订单将会被取消，如遇支付问题，请洽询
          <button
            class="service-btn"
            open-type="contact"
            @click="handleContact"
            @contact="bindContact"
          >
            <text class="text">在线客服</text>
          </button>
        </view>
        <text class="countdown icon-font icon-shengyushijian">支付剩余时间：{{ orderInfo.countDownTime || '' }}</text>
      </view>
      <OrderDetailInfo 
        :orderCode="orderInfo.orderCode"
        :orderTime="orderInfo.orderTime"
        :orderPrice="get(orderInfo, 'amount.amount')"
        :billInfo="orderInfo.orderInvoice" /> 
      <view class="patch-box">
        <view class="patch-box-inner">
        <!-- 配送信息 -->
        <OrderDeliveryInfo :orderInfo="orderInfo"/>
        <!-- 订单摘要 -->
        <OrderProductList :products="productList" />
        </view>
      </view>
      <!-- 订单金额汇总 -->
      <OrderAmountInfo :orderAmount="get(orderInfo, 'amount.amount')" />
      <!-- 处理按钮 -->
      <view class="fixed-button-wrap" v-if="!isSuccess">
        <view class="button-container">
          <customButton :btnWidth="690" className="big-btn" @click="handleOrderPay">立即支付</customButton>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import OrderProductList from '@/components/al-orderProductList';
import OrderDetailInfo from '@/components/al-orderDetailInfo';
import OrderDeliveryInfo from '@/components/al-orderDeliveryInfo';
import OrderAmountInfo from '@/components/al-orderAmountInfo';
import customButton from '@/components/al-button/normal';
import navBarHeight from '@/components/common/navBarHeight';
import { get } from '@/utils/utilityOperationHelper';
import { splitCartQuantity } from '@/utils/cart';
import { currency } from '@/filters';

export default {
  components: { OrderProductList,
   OrderDetailInfo, OrderAmountInfo, OrderDeliveryInfo,
   customButton },
  name: 'PayResult',
  mixins: [navBarHeight],
  data() {
    return {
      orderId: '',
      isRePay: false,
      isSuccess: true,
      orderInfo: {},
    };
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  onLoad({ orderId, isRePay, isSuccess }) {
    this.orderId = orderId;
    this.isRePay = isRePay;
    this.isSuccess = isSuccess === 'yes';
  },
  onShow() {
    if (this.orderId) {
      this.getOrderDetail(this.orderId).then((res) => {
        this.orderInfo = res;
        // 加入倒计时
        this.loopCountDown();
        if (this.isSuccess) {
          const orderNo = res.orderCode
          const amount = get(res, 'amount.amount')
          const orderTime = new Date(get(res, 'orderTime').replace(/\-/g, '/')).getTime()
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
          this.srTrackOrder('payed', trackData)
        }
      });
    }
  },
  methods: {
    get,
    ...mapActions('order', ['getOrderDetail', 'orderPay']),
    ...mapMutations('globle', ['setTabSelected']),
    handleOrderPay() {
      const orderNo = this.orderInfo.orderCode
      const amount = get(this.orderInfo, 'amount.amount')
      const orderTime = new Date(get(this.orderInfo, 'orderTime').replace(/\-/g, '/')).getTime()
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
      this.srTrackOrder('pay', trackData)
      this.orderPay({ orderNo }).then(() => {
        uni.redirectTo({
          url: `/subPackages/payResult/pages/index?orderId=${orderNo}&isSuccess=yes`,
        })
        this.isSuccess = true
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
    handleGoBackHome() {
      this.setTabSelected(0);
      uni.switchTab({
        url: '/pages/index/index',
      });
    },
    srTrackOrder(orderStatus, params) {
      params.order.order_status = orderStatus
      this.$sr.track('custom_order', params)
    },
    handleContact() {},
    bindContact() {},
     // 循环倒计时 ----> tips: 倒计时都要统一
    loopCountDown() {
      const that = this;
      if (this.orderInfo.orderStatus == 'WAIT_PAY') {
        const countDownFn = setInterval(() => {
          if (that.countDownFun(this.orderInfo.paySurplusTime) === '0') {
            const orderNo = this.orderInfo.orderCode;
            const amount = get(this.orderInfo, 'amount.amount');
            const orderTime = new Date(get(this.orderInfo, 'orderTime').replace(/\-/g, '/')).getTime()
            const trackData = {
              order: {
                order_id: orderNo,
                order_time: orderTime,
                // openId: uni.getStorageSync(OPEN_ID),
              },
              sub_orders: [
                {
                  sub_order_id: orderNo,
                  order_amt: amount,
                  pay_amt: amount,
                },
              ],
            };
            this.getOrderData(this.orderInfo.orderCode);
            // 执行刷新
            this.srTrackOrder('cancel_give_order', trackData);
            clearInterval(countDownFn); // 清除定时器
          } else {
            const time = this.orderInfo.paySurplusTime--;
            this.orderInfo.countDownTime = that.countDownFun(time);
            that.$set(
              that.orderInfo,
              this.orderInfo.countDownTime,
              that.countDownFun(this.orderInfo.paySurplusTime),
            );
          }
        }, 1000);
      }
    },
    // 支付剩余时间倒计时
    // 倒计时
    countDownFun(time) {
      const result = time; // 计算出豪秒
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
  },
  computed: {
    addressDetail() {
      const {
        province,
        city,
        district,
        address,
      } = get(
        this.orderInfo,
        'receiptInfo',
        {},
      );
      return `${province || ''} ${city || ''} ${district || ''} ${address || ''}`;
    },
    productList() {
      return splitCartQuantity((this.orderInfo.orderLines || []).map((order) => {
        let extObj
        try {
          extObj = JSON.parse(order.extInfos)
        } catch (error) {
          extObj = {}
        }
        const { size, material, style } = extObj
        return {
          ...order,
          size,
          material,
          style,
        }
      }))
    },
    orderTime() {
      const { orderTime = '' } = this.orderInfo
      const idx = orderTime.indexOf('+') - 1
      return orderTime.substring(0, idx)
    },
  },
  filters: {
    currency
  }
};
</script>

<style lang="scss" scoped>
  @import './index';
</style>
