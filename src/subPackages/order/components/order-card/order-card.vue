  <!-- 首页产品轮播 -->
<template name="orderCard">
  <view class="order-card">
    <view class="order-card-content">
      <!-- 待支付订单信息 -->
      <view class="unpaid" v-if="orderData.node.orderStatus == 'WAIT_PAY'">
        <view class="order-card-header">
          <view class="order-num">订单编号：<text :userSelect="true">{{orderData.node.orderCode}}</text></view>
          <view class="order-status" v-if="cardData.countDownTime == 0">已取消</view>
          <view class="order-status" v-else>待支付</view>
        </view>
        <view class="order-info" @click="goOrderDetail(orderData)">
          <image class="prd-image" :src="orderData.node.orderLines[0].image" mode="heightFix" />
          <view class="order-info-item">下单时间：{{orderData.orderTime}}</view>
          <view class="order-info-item">商品数量：{{orderData.totalQuantity}}
          </view>
          <view class="order-info-item">订单金额：￥{{orderData.node.amount.amount  | formatMoney}}</view>
        </view>
        <view class="order-count-down">
          <text class="icon-font icon-icon-shijian"></text>
          支付剩余倒计时： {{cardData.countDownTime || 0}}
        </view>
        <customButton
          v-if="cardData.countDownTime ? cardData.countDownTime!= 0 : false"
          :btnWidth="686"
          :btnHeight="80"
          className="big-btn"
          @click="goPay(orderData)"
        >
        立即支付</customButton>
      </view>
      <!--待发货，待收货，已完成，已取消 -->
      <view class="order-info-box" v-else>
        <view class="order-card-header">
          <view class="order-num">订单编号：<text :userSelect="true">{{orderData.node.orderCode}}</text></view>
          <view class="order-status" v-if="orderData.node.orderStatus == 'WAIT_DELIVERY'">待发货</view>
          <view class="order-status" v-else-if="orderData.node.orderStatus == 'WAIT_RECEIVE'">待收货</view>
          <view class="order-status" v-else-if="orderData.node.orderStatus == 'WAIT_EVALUATE'">已发货</view>
          <view class="order-status" v-else-if="orderData.node.orderStatus == 'COMPLETED'">已完成</view>
          <view class="order-status" v-else-if="orderData.node.orderStatus == 'CANCELED'">已取消</view>
          <view class="order-status" v-else-if="orderData.node.orderStatus == 'AUTO_CANCEL'">自动取消</view>
          <view v-else>其它</view>
        </view>
        <view  @click="goOrderDetail(orderData)">
          <view class="order-info">
            <view class="order-info-item">下单时间：{{orderData.orderTime}}</view>
            <view class="order-info-item">商品数量：{{orderData.totalQuantity}}</view>
            <view class="order-info-item">订单金额：￥{{orderData.node.amount.amount | formatMoney}}</view>
          </view>
          <view class="order-image-list">
            <view class="img-box" v-if="orderData.node.orderLines.length > 3 ">
              <template v-for="(item,index) in orderData.node.orderLines.slice(0,3)" >
                <image :key="index" class="prd-image" :src="item.image" mode="heightFix" />
              </template>
            </view>
            <view class="img-box" v-else>
              <template v-for="(item,index) in orderData.node.orderLines" >
                <image :key="index" class="prd-image" :src="item.image" mode="heightFix" />
              </template>
            </view>
            <view class="overflow" v-if="orderData.node.orderLines.length >3 ">
              ...
            </view>
            <view class="icon-box">
              <text class="icon-font icon-icon-youjiantou"></text>
            </view>
          </view>
         </view>
      </view>
    </view>
  </view>
</template>
<script>
import customButton from '@/components/button/normal.vue';
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
  computed: {

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
.order-card{
  background-color: #fff;
  color: #1D1D1D;
  .order-card-header{
    position: relative;
    height: 124rpx;
    line-height: 124rpx;
    font-size: 28rpx;
    padding-right: 100rpx;
    border-bottom: 1px solid #F4F4F4;
    box-sizing: border-box;
    margin-bottom:46rpx;
    .order-status{
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .order-card-content{
    font-size: 28rpx;
    line-height: 40rpx;
    .unpaid{
      border-bottom: 1px solid #F4F4F4;
      padding: 0 32rpx 50rpx;
      .order-info{
        position: relative;
        padding-left: 234rpx;
        margin-bottom: 60rpx;
        .prd-image{
          position: absolute;
          left: 0;
          top: 0;
          width: 160rpx;
          height: 160rpx;
        }
        .order-info-item{
          margin-bottom: 20rpx;
        }
      }
      .order-count-down{
        font-size: 24rpx;
        line-height: 34rpx;
        text-align: center;
        margin-bottom: 40rpx;
        .icon-font{
          margin-right: 10rpx;
          position: relative;
          top: 2rpx;
        }
      }
    }
    .order-info-box{
      padding: 0 32rpx 50rpx;
      border-bottom: 1px solid #F4F4F4;
      .order-info{
        position: relative;
        margin-bottom: 38rpx;
        .order-info-item{
          margin-bottom: 20rpx;
        }
      }
      .order-image-list{
        display:flex;
        .img-box{
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
          .prd-image{
            margin-right: 28rpx;
            width: 160rpx;
            height: 160rpx;
          }
        }
        .overflow{
          width: 60rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 36rpx;
          color: #8E8E8E;
          letter-spacing: 6rpx;
        }
        .icon-box{
          width: 60rpx;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text{
            margin-top: 10rpx;
          }
        }
      }
    }
    .prd-image{
      width: 160rpx;
      height: 160rpx;
    }
  }

}

</style>
