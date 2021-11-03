<template>
  <view class="order-detail" :style="{ 'padding-top': ktxStatusHeight }">
    <!-- header -->
    <custom-nav-bar title="订单详情" :has-left-radius="true"/>
    <view v-if="isLoading">
      <view class="order-status-box">
        <view class="status icon-font" :class="{ 
          'icon-yiquxiao': orderData.orderStatus === STATUS_CODE.AUTO_CANCEL || orderData.orderStatus === STATUS_CODE.CANCELED,
          'icon-daifahuo': orderData.orderStatus === STATUS_CODE.WAIT_DELIVERY || orderData.orderStatus === STATUS_CODE.PARTIAL_PAID,
          'icon-shengyushijian': orderData.orderStatus === STATUS_CODE.WAIT_PAY || orderData.orderStatus === STATUS_CODE.WAIT_RECEIVE ||
          orderData.orderStatus === STATUS_CODE.WAIT_EVALUATE || orderData.orderStatus === STATUS_CODE.PARTIAL_SHIPPED ||
          orderData.orderStatus === STATUS_CODE.PARTIAL_RECEIVED,
          'icon-zhifuchenggong': orderData.orderStatus === STATUS_CODE.COMPLETED
        }">{{ STATUS_TXT[orderData.orderStatus] }}</view>
      </view>
      <OrderDetailInfo 
        :orderCode="orderData.orderCode"
        :orderTime="orderData.orderTime"
        :orderPrice="orderData.productAmount.amount"
        :billInfo="orderData.orderInvoice" /> 
    </view>
    <view class="order-detail-content" v-if="isLoading">
      <!-- 订单操作 -->
      <view class="unpaid-action-content" v-if="orderData.orderStatus === 'WAIT_PAY' || orderData.orderStatus ==='AUTO_CANCEL'">
        <view class="action-btn-group">
          <customButton
            :btnWidth="330"
            :btnHeight="80"
            className="big-btn"
            style="margin-right: 30rpx"
            @click="handleOrderPay"
            >立即支付</customButton>
          <customButton
            :btnWidth="330"
            :btnHeight="80"
            className="transparent"
            @click="handlecancelOrderConfirm()"
            >取消订单</customButton>
        </view>
        <view class="order-count-down">
          <text class="icon-font icon-shengyushijian"></text>
          支付剩余时间：{{ orderData.countDownTime || '' }}
        </view>
      </view>
      <!-- 配送物流信息 -->
      <OrderDeliveryInfo :orderInfo="orderData"/>
      <!-- 订单摘要 -->
      <OrderProductList :products="productList"/>
      <!-- 商品总计 -->
      <view style="margin: -30rpx">
        <OrderAmountInfo :orderAmount="orderData.productAmount.amount" />
      </view>
    </view>
    <!--取消订单二次确认 -->
    <view class="message-box" v-if="messageVisible">
      <view class="message-inner">
        <view class="message-title">取消订单</view>
        <view class="message-info">您确定要取消该笔订单吗？</view>
        <view class="message-footer">
          <customButton
            class="cancel"
            :btnWidth="240"
            :btnHeight="70"
            className="big-btn"
            @click="noMessage">
            暂不取消
          </customButton>
          <customButton
            :btnWidth="240"
            :btnHeight="70"
            className="transparent"
            @click="handleDelete">
            确认取消
          </customButton>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import customButton from '@/components/al-button/normal';
import OrderDetailInfo from '@/components/al-orderDetailInfo';
import OrderDeliveryInfo from '@/components/al-orderDeliveryInfo';
import OrderAmountInfo from '@/components/al-orderAmountInfo';
import OrderProductList from '@/components/al-orderProductList';
import { get } from '@/utils/utilityOperationHelper';
import { priceFormat } from '@/utils/utils';
import { STATUS_TXT, STATUS_CODE } from '@/constants/order';
import { splitCartQuantity } from '@/utils/cart';

export default {
  name: 'order',
  components: {
    customButton,
    OrderDetailInfo,
    OrderDeliveryInfo,
    OrderProductList,
    OrderAmountInfo
  },
  data() {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight,
      orderData: {
        orderStatus: 'paid',
        logistics: [{}],
        productAmount: {
          amount: 0,
        },
      },
      orderId: '',
      messageVisible: false,
      countDownFn: null,
      isLoading: false,
      STATUS_TXT,
      STATUS_CODE
    };
  },
  computed: {
    productList() {
      return splitCartQuantity((this.orderData.orderLines || []).map((order) => {
        let extObj;
        try {
          extObj = JSON.parse(order.extInfos);
        } catch (error) {
          extObj = {};
        }
        const { size, material, style } = extObj;
        return {
          ...order,
          size,
          material,
          style,
        };
      }));
    },
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  onLoad({ orderCode }) {
    this.orderCode = orderCode;
    this.getOrderData(this.orderCode);
  },
  beforeDestroy() {
    clearInterval(this.countDownFn);
    this.countDownFn = null;
  },
  methods: {
    get,
    ...mapActions('order', ['getOrderDetail', 'orderPay', 'orderCancel']),
    priceFormat,
    getOrderData(params) {
      uni.showLoading({
        title: '加载中...',
      });
      this.getOrderDetail(params)
        .then((res) => {
          this.orderData = res;
          this.loopCountDown();
          uni.hideLoading();
          this.isLoading = true
        })
        .catch((e) => {
          console.log('查询订单详情失败', e);
        });
    },
    handleOrderPay() {
      const orderNo = this.orderData.orderCode;
      const amount = get(this.orderData, 'amount.amount');
      const orderTime = new Date(get(this.orderData, 'orderTime').replace(/\-/g, '/')).getTime()
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
      this.srTrackOrder('pay', trackData);
      this.orderPay({ orderNo })
        .then(() => {
          uni.redirectTo({
            url: `/subPackages/payResult/pages/index?orderId=${orderNo}&isSuccess=yes`,
          });
        })
        .catch((error) => {
          this.srTrackOrder('cancel_pay', trackData);
          uni.showToast({
            title: error.message,
            icon: 'none',
          });
          console.log(error);
        });
    },
    handlecancelOrderConfirm(skuCodes) {
      this.currentDelSkuCodes = skuCodes;
      this.messageVisible = true;
    },
    handleDelete() {
      this.candelOrder(this.currentDelSkuCodes);
      this.messageVisible = false;
    },
    // 暂不取消
    noMessage() {
      this.messageVisible = false;
    },
    // 取消订单传id
    candelOrder() {
      const orderId = this.orderData.orderCode;
      this.orderCancel(orderId)
        .then(() => {
          const orderNo = this.orderData.orderCode;
          const amount = get(this.orderData, 'amount.amount');
          const orderTime = new Date(get(this.orderData, 'orderTime').replace(/\-/g, '/')).getTime()
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
          // this.srTrackOrder('cancel_give_order', trackData);
          this.getOrderData(orderId);
        })
        .catch((error) => {
          console.log(error);
          // Do nothing
        });
    },
    // 腾讯有数
    srTrackOrder(orderStatus, params) {
      params.order.order_status = orderStatus;
      this.$sr.track('custom_order', params);
    },
    // 循环倒计时
    loopCountDown() {
      console.log('this.orderList', this.orderData);
      const that = this;
      if (this.orderData.orderStatus == 'WAIT_PAY') {
        const countDownFn = setInterval(() => {
          if (that.countDownFun(this.orderData.paySurplusTime) === '0') {
            const orderNo = this.orderData.orderCode;
            const amount = get(this.orderData, 'amount.amount');
            const orderTime = new Date(get(this.orderData, 'orderTime').replace(/\-/g, '/')).getTime()
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
            this.getOrderData(this.orderData.orderCode);
            // 执行刷新
            this.srTrackOrder('cancel_give_order', trackData);
            clearInterval(countDownFn); // 清除定时器
          } else {
            const time = this.orderData.paySurplusTime--;
            this.orderData.countDownTime = that.countDownFun(time);
            that.$set(
              that.orderData,
              this.orderData.countDownTime,
              that.countDownFun(this.orderData.paySurplusTime),
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
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
