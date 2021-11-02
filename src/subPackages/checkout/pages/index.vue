<template>
  <view class="checkout-container" :style="{ 'padding-top': computedHeight }">
    <custom-nav-bar title="订单结算" />
    <view class="container">
        <view class="delivery-box">
          <view class="addr-box">
            <view class="title">
              <text class="label icon-font icon-peisongxinxi">配送信息</text>
              <text class="import-addr-btn icon-font icon-weixindizhijifapiaoxinxi" @click="handleAuthAddr">导入微信地址</text>
            </view>
            <view class="info-box" v-if="addressInfo">
              <view style="margin-bottom: 10rpx">
                <text>{{addressInfo.receiverName}}</text>
                <text>{{addressInfo.receiverMobile}}</text>
              </view>
              <view>{{addressInfo.province}} {{addressInfo.city}} {{addressInfo.district}} {{addressInfo.address}}</view>
              <view class="edit-addr-btn" @click="selectAddress"></view>
              <view class="form-error" v-if="!addressInfo.addressVerify">该地区暂不支持配送请重新选择地址</view>
            </view>
            <view v-else class="select-addr-btn" @click="selectAddress">添加配送地址</view> 
        </view>
        <view class="field-item">
          <text class="label icon-font icon-peisongfangshi">配送方式</text>
          <view class="value">顺丰速运</view>
        </view>
        <view class="field-item">
          <text class="label icon-font icon-zhifufangshi">支付方式</text>
          <view class="value">微信支付</view>
        </view>
      </view>
      <!-- 发票 -->
      <view class="bill-box">
        <view class="checkbox-item">
          <z-checkbox
              @checkEvent="handleBillCheck"
              :checked="isNeedBill"
            ></z-checkbox>
          <text class="label">电子发票</text>
        </view>
        <view class="field-form" :style="{ display: isNeedBill ? 'block' : 'none' }">
            <view class="radio-box">
              <view class="radio-group">
                <view class="radio-item" @click="personalInvoiceCheckd = true">
                  <view class="radio" :class="{ 'checked': personalInvoiceCheckd }"></view>
                  <text>个人</text>
                </view>
                <view class="radio-item" @click="personalInvoiceCheckd = false">
                  <view class="radio" :class="{ 'checked': !personalInvoiceCheckd }"></view>
                  <text>公司</text>
                </view>
              </view>
              <text class="import-bill-btn icon-font icon-weixindizhijifapiaoxinxi">导入发票信息</text>
            </view>
            <template v-if="personalInvoiceCheckd">
              <view class="form-item-input">
                <input
                  v-model="personalInvoiceTitle"
                  @input="handleValid(personalInvoiceTitle, 'personalTitle')"
                  @blur="handleValid(personalInvoiceTitle, 'personalTitle')"
                  placeholder="请输入发票抬头"
                />
                <view class="error-wrap" v-show="errorInfo.personalTitle">
                  <form-error>发票抬头不能为空</form-error>
                </view>
              </view>
          </template>
          <template v-else>
            <view class="form-item-input">
              <input
                placeholder="请输入公司名称"
                @input="handleValid(companyInvoice.title, 'companyTitle')"
                @blur="handleValid(companyInvoice.title, 'companyTitle')"
                v-model="companyInvoice.title"
              />
              <view class="error-wrap" v-show="errorInfo.companyTitle">
                <form-error>公司名称不能为空</form-error>
              </view>
            </view>
            <view class="form-item-input">
              <input
                placeholder="请输入纳税人识别号/统一社会信用代码"
                @input="handleValid(companyInvoice.taxNumber, 'taxNumber')"
                @blur="handleValid(companyInvoice.taxNumber, 'taxNumber')"
                v-model="companyInvoice.taxNumber"
              />
              <view class="error-wrap" v-show="errorInfo.taxNumber">
                <form-error>纳税人识别号/统一社会信用代码不能为空</form-error>
              </view>
            </view>
            <view :style="{ display: isFold ? 'none' : 'block' }">
              <view class="form-title">公司其他信息</view>
              <view class="form-item-input">
                <input 
                v-model="companyInvoice.vatRegisteredAddr" 
                placeholder="注册地址（选填）" />
              </view>
              <view class="form-item-input">
                <input 
                v-model="companyInvoice.vatTelephone"
                placeholder="注册电话（选填）" />
              </view>
              <view class="form-item-input">
                <input 
                v-model="companyInvoice.vatBankName"
                placeholder="开户银行（选填）" />
              </view>
              <view class="form-item-input">
                <input 
                v-model="companyInvoice.vatBankAccount"
                placeholder="开户账号（选填）" />
              </view>
            </view>
            <view class="handle-icon" @click="isFold = !isFold">
              {{ isFold ? '展开' : '收起' }}
              <text class="icon-font icon-zhankai" :class="{ 'rotate': !isFold }"></text>
            </view>
          </template>
        </view>
      </view>
      <!-- 商品摘要 -->
      <OrderProductList :products="productList"/>
      <!-- 订单综合信息 -->
      <view style="margin: -30rpx">
        <OrderAmountInfo :orderAmount="get(orderAmount, 'productAmount.amount')" />
      </view>
    </view>
    <view class="submit-btn-wrapper">
        <view class="agreement-content" id="privacy">
          <z-checkbox
            @checkEvent="handleReceiverCheck"
            :checked="isAgree"
          ></z-checkbox>
          <view class="privacy-txt" @click="handleReceiverCheck"> 我已阅读并接受ALAIA<view class="under-line" @click.stop="handleToRule">销售条款</view>及
          <view class="under-line" @click.stop="handleToPrivacy">隐私政策</view>。</view>
        </view>
        <form report-submit="true">
          <view class="button-container" >
            <view class="total-price">
              总计: {{get(orderAmount, 'productAmount.amount') | currency }}
            </view>
            <button class="btn-submit" form-type="submit" @click="handleCreateOrder">微信支付</button>
          </view>
        </form>
      </view>
  </view>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import zCheckbox from '@/components/al-checkbox';
import navBarHeight from '@/components/common/navBarHeight';
import OrderProductList from '@/components/al-orderProductList';
import OrderAmountInfo from '@/components/al-orderAmountInfo';
import { trackWechatAd } from '@/service/apis';
import { priceFormat } from '@/utils/utils';
import { getColorBySkuInfo } from '@/utils/product';
import { get } from '@/utils/utilityOperationHelper';
import FormError from '../components/FormError.vue'
import weixinSupport from './weixinSupport.mixin'

import {
  WX_INFO, ORDER_INFO, PROTOCOL, USER_INFO,
  AGREE,
} from '../../../constants/user'

import { getCategory, getSizeBySkuInfo } from '../../../utils/product'
import {
  CURRENCY_CODE, PRODUCT_TYPE, INVOICE_TITLE_TYPE, INVOICE_CARRIER, SKU_SPLIT,
} from '../../../constants/order'
import { currency } from '@/filters';


const defaultMoneyObj = {
  amount: 0,
  currencyCode: CURRENCY_CODE,
}

export default {
  components: {
    zCheckbox,
    OrderProductList,
    OrderAmountInfo,
    FormError,
  },
  data() {
    return {
      isNeedBill: false,
      isAgree: false,
      isSubscribe: false,
      originIsSubscribe: false,
      pageFromCart: false,
      userMobile: '',
      productList: [],
      giftMessage: '',
      transportMethodsInfo: {},
      orderLines: [],
      accountInfo: {},
      addressList: [],
      errorInfo: {
        personalTitle: false,
        companyTitle: false,
        taxNumber: false,
        address: false,
      },
      submitLoading: false,
      // 导购的信息
      guideInfo: null,
      isWhiteGloveService: true,
      // 是否是上海市
      isShangHaiProvince: false,
      // 订单价格相关的
      orderAmount: {
        coupon: { ...defaultMoneyObj },
        discount: { ...defaultMoneyObj },
        tax: { ...defaultMoneyObj },
        productAmount: { ...defaultMoneyObj },
        freight: { ...defaultMoneyObj },
        amount: { ...defaultMoneyObj },
        giftCard: { ...defaultMoneyObj },
        additionalServiceFee: { ...defaultMoneyObj },
      },
      personalInvoiceTitle: '',
      companyInvoice: {
        title: '',
        taxNumber: '',
        vatRegisteredAddr: '',
        vatTelephone: '',
        vatBankName: '',
        vatBankAccount: ''
      },
      isFold: true
    };
  },
  mixins: [weixinSupport, navBarHeight],
  computed: {
    ...mapGetters('order', ['invoiceInfo', 'addressInfo']),
    ...mapState('order', ['addressInfo']),
    ...mapState('globle', ['advertisingParam']),
    ...mapGetters('qy', ['isQY']),
    isShowReg() {
      return !!this.userMobile
    },
    totalQuantity() {
      return this.productList.reduce((total, v) => total + v.quantity, 0)
    },
  },
  async onLoad({ fromCart }) {
    const orderInfo = uni.getStorageSync(ORDER_INFO)
    this.getDeliveryAddresses()
    this.pageFromCart = !!fromCart
    this.orderLines = get(orderInfo, 'orderLines') || []
    // 导购信息
    this.guideInfo = get(orderInfo, 'guideInput') || null
    try {
      await this.loginByAuthCode()
      this.handleGetUserInfo()
    } catch (error) {
      console.error(error, '获取用户信息失败')
    }
    // form mixin
    this.getRegionsList()
    // 获取商品信息
    this.getProductByCode()
    // 价格计算
    this.getCartItemCalc()
    // 推出则清空发票信息
    this.setInvoiceInfo(null)
    this.transportMethods().then((res) => {
      this.transportMethodsInfo = res
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  methods: {
    get,
    priceFormat,
    ...mapActions('order', ['getCartItem', 'orderPay', 'setInvoiceInfo', 'setAddressInfo', 'orderCreate', 'transportMethods']),
    ...mapActions('common', ['wxSubscribe', 'getAccessToken']),
    ...mapActions('user', ['loginByAuthCode', 'getUserInfo', 'updateAccountInfo', 'deliveryAddressesApi']),
    ...mapActions('product', ['getProductList', 'getProductListBySku']),
    ...mapActions('shoppingCart', ['queryCartInfo']),
    async getDeliveryAddresses() {
      try {
        const list = await this.deliveryAddressesApi({ size: 999, page: 1 });
        this.addressList = get(list, 'data.customer.deliveryAddresses.edges', [])
        const defaultAddress = this.addressList.find((v) => v.node.isDefault)
        if (defaultAddress) {
          this.setAddressInfo(defaultAddress.node)
        }
      } catch (err) {
        console.error(err)
      }
    },
    handleGetUserInfo(firstGet = true) {
      try {
        const { mobile, accountInfo } = uni.getStorageSync(USER_INFO) || {}
        this.accountInfo = accountInfo
        this.userMobile = mobile || ''
        if (accountInfo && accountInfo.ext) {
          const { agreePolicy, agreePromote } = JSON.parse(accountInfo.ext) || {}
          if (firstGet) {
            this.isAgree = agreePolicy === AGREE
            // 如果数据库中查询没有勾选，那么看看本地localstorage中是否存储了数据
            this.isSubscribe = agreePromote === AGREE ? true : this.getLocalSub()
            this.originIsSubscribe = this.isSubscribe
          }
        }
      } catch (error) {
        console.error(error, '获取用户信息失败')
      }
    },
    getLocalSub() {
      return (uni.getStorageSync(PROTOCOL) || '') === AGREE
    },
    handleInvoiceTap() {
      uni.navigateTo({
        url: '../invoice/index',
      });
    },
    selectAddress() {
      uni.navigateTo({
        url: `/subPackages/address/pages/list/index?source=checkoutPage&code=${this.addressInfo && this.addressInfo.code}`,
      })
    },
    getProductByCode() {
      const skuCodes = this.orderLines.map((item) => item.skuCode) || []
      this.getProductListBySku(skuCodes).then((list) => {
        if (list) {
          this.productList = (list || []).map((product) => {
            const orderLine = this.orderLines.find((item) => (item.skuCode === get(product, 'code')))
            return {
              sort: orderLine.sort,
              skuCode: product.code,
              quantity: get(orderLine, 'quantity'),
              size: getSizeBySkuInfo(product),
              style: getColorBySkuInfo(product),
              ...product,
              ...product.product,
            }
          })
          this.productList.sort((a, b) => a.sort - b.sort)
        }
      })
    },
    handleReceiverCheck() {
      this.isAgree = !this.isAgree
    },
    handleBillCheck() {
      this.isNeedBill = !this.isNeedBill
    },
    // 是否同意接受产品和活动信息
    handleSubscribeCheck() {
      // 将信息存储, 方便同步到个人中的勾选项
      this.isSubscribe && (uni.setStorageSync(PROTOCOL, AGREE))
    },
    getCartItemCalc(receipt) {
      if (!this.orderLines || this.orderLines.length === 0) {
        return Promise.resolve()
      }
      const params = {
        cartItems: (this.orderLines.map((item) => ({ skuCode: item.skuCode, quantity: item.quantity }))) || [],
      }
      if (Object.prototype.toString.call(receipt) === '[object Object]' && Object.keys(receipt).length > 0) {
        params.receipt = {
          ...receipt,
          distributionType: 'EXPRESS',
          logisticsCompanyCode: get(this.transportMethodsInfo, 'transportMethod'),
        }
      }

      return this.getCartItem(params).then((res) => {
        this.orderAmount = {
          ...this.orderAmount,
          ...{
            productAmount: get(res, 'productAmount'),
            tax: get(res, 'tax'),
            coupon: get(res, 'coupon'),
            amount: get(res, 'amount'),
            discount: get(res, 'discount'),
            freight: get(res, 'postage'),
          },
        }
        return res
      })
    },
    async handleCreateOrder() {
      let invoiceError = null
      // personalInvoiceCheckd from mixin
      if (this.personalInvoiceCheckd) {
        invoiceError = this.handleValid(this.personalInvoiceTitle, 'personalTitle')
      } else {
        const titleFlag = this.handleValid(this.companyInvoice.title, 'companyTitle')
        const taxNumberFlag = this.handleValid(this.companyInvoice.taxNumber, 'taxNumber')
        invoiceError = titleFlag || taxNumberFlag
      }
      // 校验地址是否支持配送
      if (this.addressInfo) {
        if (!this.addressInfo.addressVerify) {
          this.handleScrollTo('address')
          return
        }
      } else {
        this.handleScrollTo('address')
        this.errorInfo.address = true
        return
      }

      if (invoiceError && this.isNeedBill) {
        this.handleScrollTo('invoice')
        return
      }

      // 校验隐私和销售条例是否同意
      if (!this.isAgree) {
        uni.showToast({
          title: '请阅读并同意销售条款及隐私政策',
          icon: 'none',
        })
        return;
      }

      if (this.submitLoading) {
        return;
      }

      this.submitLoading = true
      try {
        this.handleGetUserInfo(false)
        const addressInfoRes = {
          address: this.addressInfo.address,
          country: '中国',
          province: get(this.addressInfo, 'province'),
          provinceId: parseInt(get(this.addressInfo, 'provinceId')),
          city: get(this.addressInfo, 'city'),
          cityId: parseInt(get(this.addressInfo, 'cityId')),
          district: get(this.addressInfo, 'district'),
          districtId: parseInt(get(this.addressInfo, 'districtId')),
          mobile: get(this.addressInfo, 'receiverMobile'),
          name: get(this.addressInfo, 'receiverName'),
        }

        const params = {
          orderLines: [],
          terminal: 'WAP',
          buyerRemark: this.giftMessage,
          receiptInfo: {
            ...addressInfoRes,
            distributionType: 'EXPRESS',
            mobile: this.addressInfo.receiverMobile,
            logisticsCompanyCode: 'SF',
          },
          deleteSkusFromCart: this.pageFromCart,
          platformSource: 'WEIXIN_MINI_PROGRAM',
          ...this.orderAmount,
        }

        // 订单行
        params.orderLines = this.productList.map((product) => {
          const styleItem = get(product, 'showAttrList', []).find((v) => v.code === 'customSizeDesc')
          return {
            skuCode: get(product, 'skuCode'),
            name: get(product, 'title'),
            image: get(product, 'images[0].url'),
            quantity: get(product, 'quantity'),
            skuProperties: `${get(product, 'subTitle') || ''}${SKU_SPLIT}${get(product, 'skuCode')}`,
            extInfos: JSON.stringify({
              category: getCategory(product),
              material: this.getMaterial(product),
              size: product.size === '00' ? '' : product.size,
              style: get(styleItem, 'attrValueList[0].frontName', ''),
            }),
            lineType: PRODUCT_TYPE.PRODUCT,
          }
        })
        // 携带 用户的微信昵称，用于分销功能的BA订单展示
        params.extInfos = JSON.stringify({ ...params.receiptInfo, userNickName: get(uni.getStorageSync(WX_INFO), 'nickName') })
        // 发票信息
        params.invoice = (this.isNeedBill && this.getInvoice()) || null; // 跳过支付

        try {
          const order = await this.orderCreate(params)
          const orderNo = get(order, 'code')
          const amount = get(order, 'amount.amount')
          const orderTime = new Date(get(order, 'orderTime').replace(/\-/g, '/')).getTime()
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
          this.srTrackOrder('give_order', trackData)
          const advertisingParams = uni.getStorageSync('advertisingParam') || this.advertisingParam
          console.log('hgggggggg>>>>', advertisingParams)
          this.$nextTick(() => {
            setTimeout(() => {
              this.srTrackOrder('pay', trackData)
            }, 2000);
          })
          if (advertisingParams && advertisingParams.gdt_vid) {
            this.wechatTrackOrder(amount, advertisingParams.gdt_vid)
          }
          this.orderPay({ orderNo, isFirstPay: true }).then(() => {
            uni.redirectTo({
              url: `/subPackages/payResult/pages/index?orderId=${orderNo}&isSuccess=yes`,
            })
          }).catch(() => {
            this.srTrackOrder('cancel_pay', trackData)
            uni.redirectTo({
              url: `/subPackages/payResult/pages/index?orderId=${orderNo}`,
            })
          })
          // 更新一下购物车数量
          this.queryCartInfo()
          // 埋点
        } catch (error) {
          this.submitLoading = false
          console.error('创单失败', error)
        }
      } catch (error) {
        uni.hideLoading()
        this.submitLoading = false
        console.log('下单接口之前的参数组装异常', error)
      }
    },
    srTrackOrder(orderStatus, params) {
      params.order.order_status = orderStatus
      this.$sr.track('custom_order', params)
    },
    async wechatTrackOrder(amount, clickId) {
      try {
        // const token = await this.getAccessToken()
        const currentPage = getCurrentPages()[getCurrentPages().length - 1]
        console.log('tttttt>>>>', currentPage)
        console.log('amountamountamount>>>>', amount)
        await trackWechatAd({
          user_action_set_id: 1200031323, // 事先生成的数据源ID、写死
          actions: [
            {
              url: `http://wwww.qq.com${currentPage.$page.fullPath}`,
              action_time: parseInt((+new Date()) / 1000),
              action_type: 'COMPLETE_ORDER',
              trace: {
                click_id: clickId,
              },
              action_param: {
                value: amount * 100,
              },
              value: amount * 100,
              user_id: {
                wechat_openid: uni.getStorageSync('openId'),
                wechat_app_id: 'wxe5bd54b04e85cd62',
              },
            },
          ],
        })
      } catch (error) {
        console.error(error)
      }
    },
    handleToRule() {
      uni.navigateTo({
        url: '/subPackages/help/pages/help-detail/index?name=销售条款&templateCode=help_content&contentCode=help_sale_content',
      });
    },
    handleToPrivacy() {
      uni.navigateTo({
        url: '/subPackages/help/pages/help-detail/index?name=隐私政策&templateCode=help_content&contentCode=help_private',
      });
    },
    handleErrorShow(filedName, value) {
      this.errorInfo[filedName] = value
    },
    handleValid(value, errorName) {
      const visible = value === ''
      this.handleErrorShow(errorName, visible)
      return visible
    },
    getMaterial(product) {
      const attributes = get(product, 'attributes', [])
      const materialItem = attributes.find((item) => item.name === '具体材质&尺寸')
      const frontName = get(materialItem || {}, 'values[0].frontName')
      return frontName && frontName.split('\n')[0]
    },
    // 发票信息
    getInvoice() {
      let invoice = {
        carrier: INVOICE_CARRIER,
        type: 'PLAIN',
      }
      if (this.personalInvoiceCheckd) {
        invoice = {
          ...invoice,
          title: this.personalInvoiceTitle,
          titleType: INVOICE_TITLE_TYPE.PERSONAL,
        }
      } else {
        const { title, taxNumber: taxNo, ...restCompanyInvoice } = this.companyInvoice;
        invoice = {
          ...invoice,
          titleType: INVOICE_TITLE_TYPE.COMPANY,
          title,
          taxNo,
          ...restCompanyInvoice
        }
      }
      return invoice
    },

    // 页面跳转
    handleScrollTo(idStr) {
      uni.pageScrollTo({
        selector: `#${idStr}`,
      })
    },
    // 根据省份更改，白手套服务是否满足
    async handleChangeProvince(provinceInfo) {
      if (!provinceInfo) {
        this.isShangHaiProvince = false
        return
      }
      // 判断是否是上海
      this.isShangHaiProvince = /上海/.test(provinceInfo.name)
      // 根据地区计算价格
      try {
        await this.getCartItemCalc({
          province: provinceInfo.name,
          provinceId: provinceInfo.code,
        })
      } catch (error) {
        console.log('根据省份计算价格', error)
      }
    },
  },
  watch: {
    personalInvoiceInfo(v) {
      this.personalInvoiceTitle = v.title
      this.errorInfo.personalTitle = !v.title
    },
    companyInvoiceInfo(v) {
      this.companyInvoice = {
        title: v.title,
        taxNumber: v.taxNumber,
      }
      this.errorInfo.companyTitle = !v.title
      this.errorInfo.taxNumber = !v.taxNumber
    },
    addressInfo(v) {
      this.errorInfo.address = !!v
    },
  },
  filters: {
    currency
  },
};
</script>

<style lang="scss" scoped>
@import './index'
</style>
