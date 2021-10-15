<template>
  <view class="order-detail" :style="{ 'padding-top': ktxStatusHeight }">
    <!-- header -->
    <custom-nav-bar :head-border="false" :head-font-color="false" />
    <view class="order-detail-header">订单信息</view>
    <view class="order-detail-content" v-if="isLoading">
      <!-- 订单编号 -->
      <view class="order-num-status">
        <view class="order-num">订单编号：<text :userSelect="true">{{ orderData.orderCode || '' }}</text></view>
        <view class="order-status" v-if="orderData.orderStatus === 'WAIT_PAY'">待支付</view>
        <view class="order-status" v-if="orderData.orderStatus === 'WAIT_DELIVERY'">待发货</view>
        <view class="order-status" v-if="orderData.orderStatus === ' WAIT_RECEIVE'">已发货</view>
        <view class="order-status" v-if="orderData.orderStatus === 'COMPLETED'">已完成</view>
        <view class="order-status" v-if="orderData.orderStatus === 'CANCELED'">已取消</view>
      </view>
      <!-- 订单信息 -->
      <view class="order-info">
        <view class="order-info-item order-time"
          >下单时间：{{
            orderData.orderTime ? orderData.orderTime.substring(0, 19) : ""
          }}</view
        >
        <view class="order-info-item order-price"
          >订单金额：￥{{ priceFormat(orderData.productAmount.amount) || '' }}</view
        >
        <view class="order-info-item order-invoice"
          >发票信息：<text
            class="title-type"
            v-if="orderData.orderInvoice.titleType === 'PERSONAL'"
            >个人</text
          ><text v-else-if="orderData.orderInvoice" class="title-type">公司</text>{{ orderData.orderInvoice.title || '' }}
          <view class="order-texNo">{{
            orderData.orderInvoice.trackingNo !== null
              ? orderData.orderInvoice.trackingNo
              : ""
          }}</view>
          <view
            class="order-texNo"
            v-if="orderData.orderInvoice.eInvoiceUrl !== null"
            ><a
              @click="downFile()"
              target="_blank"
              style="text-decoration: underline"
              >下载发票</a
            ></view
          >
        </view>

        <!-- 未支付展示支付按钮 -->
        <view class="unpaid" v-if="orderData.orderStatus === 'WAIT_PAY' || orderData.orderStatus ==='AUTO_CANCEL'">
          <view class="order-count-down">
            <text class="icon-font icon-icon-shijian"></text>
            支付剩余倒计时：{{ orderData.countDownTime || 0 }}
          </view>
          <view class="mgb40">
            <customButton
              :btnWidth="686"
              :btnHeight="80"
              className="big-btn"
              @click="handleOrderPay"
              v-if="
                orderData.countDownTime ? orderData.countDownTime != 0 : false
              "
              >立即支付</customButton
            >
          </view>
          <customButton
            :btnWidth="686"
            :btnHeight="80"
            className="transparent"
            @click="handlecancelOrderConfirm()"
            >取消订单</customButton
          >
        </view>
      </view>
      <!-- 配送信息 -->
      <view class="shipping-info">
        <view class="sub-title">配送信息</view>
        <view
          ><text class="mgr40">{{ orderData.receiptInfo.name || '' }}</text
          >{{ orderData.receiptInfo.mobile || '' }}</view
        >
        <view class="shipping-info-address"
          ><text>{{ orderData.receiptInfo.province || '' }}</text
          ><text>{{ orderData.receiptInfo.district || '' }}</text
          ><text>{{ orderData.receiptInfo.address || '' }}</text></view
        >
      </view>
      <!-- 物流信息 -->
      <view class="logistics-info" v-if="orderData.logistics">
        <view class="sub-title">物流信息</view>
        <view class="tracking-num" v-if="orderData.logistics"
          >物流单号：{{
            orderData.logistics[0].trackingNo
              ? orderData.logistics[0].trackingNo
              : ""
          }}
          {{
            orderData.logistics[0].logisticsProviderName
              ? orderData.logistics[0].logisticsProviderName
              : ""
          }}
        </view>
        <view class="logistics-info-list">
          <block v-if="viewMore">
            <view
              class="logistics-info-item"
              v-for="(wlItem, index) in orderData.logisticsRoutes"
              :key="index"
            >
              <view>快递已到达{{ orderData.description }}</view>
              <view class="logistics-info-time">{{
                wlItem.modifyTime ? wlItem.modifyTime.substring(0, 19) : ""
              }}</view>
            </view>
          </block>
        </view>
        <view
          class="logistics-view-more"
          v-if="orderData.logistics.length > 1"
          @click="logViewMore"
        >
          <view v-if="viewMore"
            >收起<text class="icon-font icon-icon-shang"></text
          ></view>
          <view v-if="!viewMore"
            >展开<text class="icon-font icon-icon-xia"></text
          ></view>
        </view>
      </view>
      <!-- 订单摘要 -->
      <view class="form-item-block">
        <view class="form-item-title last">
          <view class="title-left">
            订单摘要 <text>(共{{ totalQuantity }}件)</text>
          </view>
          <view class="title-right"></view>
        </view>
        <view class="product-box">
          <view
            class="item-box"
            v-for="(product, orderIndex) in productList"
            :key="orderIndex"
          >
            <view class="product-img">
              <image :src="product.image" />
            </view>
            <view class="product-info">
              <view class="title">{{ product.name }}</view>
              <text class="sub-title">{{ product.material }}</text>
              <view class="num-box size-box">
                <text class="price" v-if="product.size !== '00' && product.size"
                  >尺寸: {{ product.size }}</text
                >
                <text class="price" v-if="product.style"
                  >款式: {{ product.style }}</text
                >
              </view>
              <view class="num-box number-box">
                <text class="number">数量: {{ product.quantity }}</text>
              </view>
              <view class="num-box">
                <text class="price"
                  >￥{{ priceFormat(product.salePrice.amount) }}</text
                >
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 商品总计 -->
      <view class="order-total">
        <view>
          <text>商品金额</text>
          <text>￥{{ priceFormat(orderData.productAmount.amount) }}</text>
        </view>
        <view>
          <text>运费</text>
          <text>免运费</text>
        </view>
        <view class="total">
          <text>总计</text>
          <text>￥{{ priceFormat(orderData.productAmount.amount) }}</text>
        </view>
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
            @click="noMessage"
          >
            暂不取消
          </customButton>
          <customButton
            :btnWidth="240"
            :btnHeight="70"
            className="transparent"
            @click="handleDelete"
          >
            确认取消
          </customButton>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import customButton from '@/components/button/normal.vue';
import { get } from '@/utils/utilityOperationHelper';
import { priceFormat } from '@/utils/utils';
import { OPEN_ID } from '@/constants/user';

export default {
  name: 'order',
  components: {
    customButton,
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
      viewMore: false,
      orderId: '',
      messageVisible: false,
      countDownFn: null,
      isLoading: false,
    };
  },
  computed: {
    totalQuantity() {
      return this.productList.reduce((total, v) => total + v.quantity, 0);
    },
    productList() {
      return (this.orderData.orderLines || []).map((order) => {
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
      });
    },
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  onLoad({ orderCode }) {
    this.orderCode = orderCode;
    this.getOrderData(this.orderCode);
  },
  onShow() {},
  beforeDestroy() {
    clearInterval(this.countDownFn);
    this.countDownFn = null;
  },
  methods: {
    get,
    ...mapActions('order', ['getOrderDetail', 'orderPay', 'orderCancel']),
    priceFormat,
    logViewMore() {
      this.viewMore = !this.viewMore;
    },
    getOrderData(params) {
      uni.showLoading({
        title: '加载中...',
      });
      this.getOrderDetail(params)
        .then((res) => {
          //  console.log(res,'qqqqqqqqqqqqq')
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
    // 下载发票
    downFile() {
      const url = this.orderData.orderInvoice.eInvoiceUrl;
      uni.showLoading({
        title: '下载中...',
      });
      uni.downloadFile({
        url,
        success(res) {
          // 保存到本地
          uni.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              const { savedFilePath } = res;
              // 打开文件
              uni.openDocument({
                filePath: savedFilePath,
                success(res) {
                  uni.hideLoading();
                },
              });
            },
            fail(err) {
              uni.hideLoading();
              uni.showLoading({
                title: '保存失败',
              });
            },
          });
        },
        fail(res) {
          uni.hideLoading();
          uni.showLoading({
            title: '下载失败',
          });
        },
      });
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
