<template>
  <view class="product-content">
    <custom-nav-bar :left-arrow="isLeftArrow" title=' ' :head-border="isHeadBorder" :head-blank="isHeadBlank" :head-font-color="isHeaderBlackColor" />
    <view class="wrapper">
      <view class="wrapper-content">
        <view class="product-banner-content">
          <swiper class="pdp-swiper-content" @change="swiperImgChange" @transition="swiperTransition" :current="currentIndex">
            <!-- <block v-if="videoTag[0]">
              <swiper-item class="swiper-item">
                <video id="videos" class="video" @play="vplay" @pause="vpause" :src="videoTag[0].picUrl" :controls="true" :show-play-btn="false" :enable-play-gesture="true" :enable-progress-gesture="false" @click="play">
                  <image class="play" v-show="paused" :src="playBtn" mode="widthFix" />
                </video>
              </swiper-item>
            </block> -->
            <swiper-item v-for="(pic, index) in productData.images" :key="index">
              <view class="swiper-item">
                <image class="imgs" @click="swiperClick(pic.url, index)" :src="imgUrlReplace(pic.url, 284, 391)" mode="widthFix" :lazy-load="true" />
              </view>
            </swiper-item>
          </swiper>
          <view class="dots-share">
            <view class="view-dost" v-if="productData.images.length">
              <view class="item" :class="[index === currentIndex ? 'active' : '']" v-for="(item, index) in productData.images" :key="index"></view>
            </view>
            <view class="share">
              <text class="icon-font icon-icon-shoucang"></text>
              <button open-type="share" class="share-btn">
                <text class="icon-font icon-icon-fenxiang"></text>
              </button>
            </view>
          </view>
        </view>
        <view class="product-info-content" :class="[!isHasSize && !isHasStyle ? 'box-margin' : '']">
          <view class="tag" v-if="productData.subTitle">
            {{ productData.subTitle }}
          </view>
          <view class="title">{{ productData.title || "" }}</view>
          <view class="price" v-if="productData.salePrice > 0">￥{{ productData.salePrice | formatMoney }}</view>
        </view>
      </view>
      <view class="product-details-content" v-if="productData.description.length">
        <view class="details-item" v-for="(item, index) in productData.description" :key="index">
          <image :src="item.url" mode="widthFix" :lazy-load="true" />
        </view>
      </view>

      <view class="suit-wrap">
        <view class="line-title">
          <view class="line"></view>
          <text class="icon-font icon-icon-tuxingxingzhuang"></text>
        </view>
        <swiper class="suit-box">
          <swiper-item>
            <image class="imgs" src="https://res-tasaki.baozun.com/static/images/boutique-750-996.jpg" mode="widthFix" :lazy-load="true" />
            <view class="title">完成这套搭配</view>
            <productSwiper @clickItem="handleClick" :products="productSuit" />
          </swiper-item>
        </swiper>
      </view>
      <recently-like-products recent />
    </view>

    <view class="pdp-buy-fixed">
      <view class="pdp-style-content">
        <view class="box-content" @click="openDialog('color')">
          <block v-if=" currentSkuInfo.options">
            <block v-for="(item,index) in currentSkuInfo.options" :key="index">
              <view class="color-box" v-if="item.originCode=='Metallic Property'">
                <image class="color" :src="item.value.images[0].url"></image>
                <text class="txt">{{item.value.name}}</text>
              </view>
            </block>
          </block>
          <text class="txt" v-else>请选择款式</text>
          <text class="icon-font icon-xiala"></text>
        </view>
        <view class="box-content" @click="openDialog('size')">
          <block v-if="currentSkuInfo.options">
            <block v-for="(item,index) in currentSkuInfo.options" :key="index">
              <text class="txt" v-if="item.originCode=='customSize'">{{item.value.name}}</text>
            </block>
          </block>
          <text class="txt" v-else>请选择尺码</text>
          <text class="icon-font icon-xiala"></text>
        </view>
      </view>
      <view class="pdp-buy-content">
        <view class="add-success-content" v-if="isAddSuccess">
          <view class="txt">该商品已添加至购物袋</view>
          <view class="to" @click.stop="toCart"><text>查看</text></view>
        </view>
        <view class="service-content">
          <button class="service-btn" open-type="contact" @click="handleContact" @contact="bindContact">
            <text class="icon-font icon-kefu"></text>
            <view class="text">客服</view>
          </button>
        </view>
        <view class="cart-content">
          <view class="cart-btn" @click.stop="toCart">
            <view class="cart-main">
              <text class="icon-font icon-shopbag"></text>
              <view class="cart-num" v-if="cartAmount && cartAmount > 0">
                {{ cartAmount }}
              </view>
            </view>
            <view class="text">购物袋</view>
          </view>
        </view>
        <view class="arrival-notice" v-if="isSaleOut || isOffShelf">
          <button v-if="isSaleOut && !isOffShelf" class="buy-btn" @click="handleArrivalNotice">到货通知</button>
          <button v-else class="buy-btn btn-dis">已下架</button>
        </view>
        <view class="buy-main" v-else>
          <button class="buy-btn" @click="handleGetUserUnionId" :data-type="BTN_TYPE.ADD_CART">加入购物袋</button>
          <button class="buy-btn btn-bg" @click="handleGetUserUnionId" :data-type="BTN_TYPE.BUY_NOW">即刻购买</button>
        </view>
      </view>
    </view>
    <sizeGuide :size-guide-show="sizeGuideShow" @clickClose="clickClose"></sizeGuide>

    <!-- 弹窗 -->
    <view class="dialog-wrap" catchtouchmove="true" v-if="dialog.show">
      <view class="dialog-mark" @click="openDialog()"></view>
      <view class="dialog-content">
        <view class="title">
          <text class="txt none" @click="openDialog()">取消</text>
          <view class="online">
            <text class="other" @click="sizeGuideClick()">尺码指南</text>
            <text class="txt" @click="changeInput(dialog.value)">确定</text>
          </view>
        </view>
        <picker-view indicator-style="height: 63px;" style="width: 100%; height: 189px;" :value="dialog.value" @change="changeDialog">
          <picker-view-column>
            <block v-for="(item,index) in dialog.data" :key="index">
              <view class="item">{{item.name}}<text v-if="item.inventory==0">-缺货</text></view>
            </block>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  mapState, mapMutations, mapActions, mapGetters,
} from 'vuex';
import { get } from '@/utils/utilityOperationHelper';
import { priceFormat, imgUrlReplace, randomString } from '@/utils/utils';
import { getProductDetailsAction, addShopCartApi } from '@/service/apis/pdp';
import navBarHeight from '@/components/common/navBarHeight';
import { ORDER_INFO, WX_INFO } from '@/constants/user';
import { ENCODE_SPLIT_SIGN } from '@/constants/share';
import { BTN_TYPE } from '@/constants/product';
import sizePicker from '@/components/picker';
import RecentlyLikeProducts from '@/pages/shoppingCar/components/RecentlyLikeProducts';
import { TYPE_CODE } from '@/constants/subscribe';
import { trackWechatAd } from '@/service/apis'
import productSwiper from '@/components/product-swiper';
import sizeGuide from './components/sizeGuide';

export default {
  name: 'Product',
  components: {
    RecentlyLikeProducts,
    sizeGuide,
    productSwiper,
  },
  mixins: [navBarHeight],
  data () {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight, // 头部的高度，用于设置样式padding-top
      isHeadBorder: false, // header border是否展示
      isHeadBlank: true, // header 是否透明
      isHeaderBlackColor: false, // header 字体颜色
      productData: {
        title: '',
        subTitle: '',
        salePrice: '',
        images: '',
        description: [],
        materialList: [],
      },
      sizeList: [],
      styleList: [],
      currentSkuCode: '',
      currentSkuStyle: '',
      isHasSize: false,
      isHasStyle: false,
      // 售罄？
      isSaleOut: false,
      isOffShelf: false,
      // 加购成功
      isAddSuccess: false,
      // 是否会员
      isMemberLogin: false,
      // 是否授权过用户信息
      isAuthorizeInfo: false,
      // 是否支持getUserProfile
      canIUseGetUserProfile: false,
      BTN_TYPE,
      code: '',
      // 轮播
      currentIndex: 0,
      videoContext: null,
      videoTag: [],
      paused: true,
      sizeGuideShow: false,
      isDisabled: false,
      isLeftArrow: true,
      dialog: {
        value: [0],
        show: false,
      },
      productSuit: [
        {
          productImg: 'https://res-tasaki.baozun.com/static/images/boutique-750-996.jpg',
          productName: '1111',
          productPrice: '1111',
        },
        {
          productImg: 'https://res-tasaki.baozun.com/static/images/boutique-750-996.jpg',
          productName: '222',
          productPrice: '222',
        },
        {
          productImg: 'https://res-tasaki.baozun.com/static/images/boutique-750-996.jpg',
          productName: '333',
          productPrice: '333',
        },
      ],
    };
  },
  onLoad (options) {
    const {
      code, scene, sku,
    } = options;
    // try {
    //   // 埋点
    //   setTrackerParams(options);
    // } catch (error) {
    //   console.log(error, '埋点设置失败');
    // }
    if (code) {
      this.code = code;
    }
    if (sku) {
      this.currentSkuCode = sku
    }
    if (scene) {
      const paramsArr = (scene || '').split(ENCODE_SPLIT_SIGN);
      this.code = paramsArr[0];
    }
    this.getProductData();
  },
  onShow () {
    const advertisingParams = uni.getStorageSync('advertisingParam') || this.advertisingParam
    if (advertisingParams && advertisingParams.gdt_vid) {
      this.getRandom(advertisingParams.gdt_vid)
    }
    this.isDisabled = false;
    this.isMemberLogin = uni.getStorageSync('isMemberLogin') || false;
    this.isAuthorizeInfo = uni.getStorageSync('isAuthorizeInfo') || false;
    if (this.isMemberLogin && this.isAuthorizeInfo) {
      this.queryCartInfo();
    }
  },
  onPullDownRefresh () {
    wx.stopPullDownRefresh(); // 阻止下拉刷新
  },
  computed: {
    ...mapState('shoppingCart', ['cartAmount']),
    ...mapGetters('user', ['unionId']),
    ...mapState('globle', ['advertisingParam']),
    skus () {
      return get(this.productData, 'skus') || [];
    },
    currentSkuInfo () {
      return this.skus.find((sku) => sku.code === this.currentSkuCode);
    },
  },
  methods: {
    imgUrlReplace,
    get,
    ...mapMutations('globle', ['setTabSelected']),
    ...mapActions('common', ['wxSubscribe', 'getAccessToken']),
    ...mapActions('shoppingCart', ['queryCartInfo']),
    ...mapActions('user', ['decryptData']),

    handleClick (item) {
      this.$sr.track('trigger_sku_component',
        {
          sku: {
            sku_id: item.skuCode || item.code || 'ALAIA', // 若商品无sku_id时，可传spu_id信息
            sku_name: item.productName || 'ALAIA', // 若商品无sku_name时，可传spu_name信息
          },
          spu: {
            spu_id: item.code || item.skuCode || 'ALAIA', // 若商品无spu_id时，可传sku_id信息
            spu_name: item.productName || 'ALAIA', // 若商品无spu_name时，可传sku_name信息
          },
          sale: {
            original_price: item.productPrice || 0, // 对接智慧零售入口必传
            current_price: item.productPrice || 0, // 对接智慧零售入口必传
          },
          primary_image_url: item.productImg,
        })
      uni.navigateTo({
        url: `/subPackages/pdp/pages/pdp/index?code=${item.code}`,
      })
    },
    // 调用广告
    async getRandom (gdt_vid) {
      try {
        // const token = await this.getAccessToken()
        const currentPage = getCurrentPages()[getCurrentPages().length - 1]
        await trackWechatAd({
          user_action_set_id: 1200031323, // 事先生成的数据源ID、写死
          actions: [
            {
              url: `http://wwww.qq.com${currentPage.$page.fullPath}`,
              action_time: parseInt((+new Date()) / 1000),
              action_type: 'VIEW_CONTENT',
              trace: {
                click_id: gdt_vid,
              },
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
    // 初始化
    async getProductData () {
      try {
        uni.showLoading({
          title: '加载中...',
        });
        const result = await getProductDetailsAction({
          codes: [this.code],
        });
        const resultData = get(result.data.shop, 'productByCode[0]') || [];
        this.isSaleOut = !get(resultData, 'inventory') > 0;
        this.isOffShelf = !get(resultData, 'onShelves');
        const images = get(resultData, 'images').filter((i) => i.type !== 'FIGUREIMAGE');
        const description = get(resultData, 'images').filter((i) => i.type === 'FIGUREIMAGE');
        const attributes = get(resultData, 'attributes').filter((i) => i.name === '具体材质&尺寸')[0].values[0].frontName;
        const attributesList = attributes.split('\n');
        const materialList = attributesList.length && attributesList.filter((i, index) => index !== 0);
        const skuList = get(resultData, 'skus');
        this.productData = {
          ...this.productData,
          ...resultData,
          ...{
            images,
            description,
            subTitle: attributesList.length && attributesList[0],
            materialList,
            salePrice: get(skuList, '[0].salePrice.amount'),
          },
        };

        const sizeList = [];
        get(resultData, 'skus').map((item) => {
          const sizeName = get(item, 'options').find((i) => i.originCode === 'customSize');
          if (sizeName.value.name != '00') {
            const items = {
              code: item.code,
              name: sizeName.value.name,
              inventory: item.inventory,
              isEnabled: item.isEnabled,
            };

            sizeList.push(items);
          }
        });
        sizeList.sort((a, b) => a.name - b.name)
        if (sizeList.length > 1 || (sizeList.length == 1 && sizeList.some((item) => item.name != '00'))) {
          this.isHasSize = true;
        }
        this.sizeList = sizeList;

        const styleList = [];
        get(resultData, 'skus').map((item) => {
          const styleName = get(item, 'options').find((i) => i.originCode === 'Metallic Property');
          if (styleName.value.name != '00') {
            const items = {
              code: item.code,
              name: styleName.value.name,
              inventory: item.inventory,
              isEnabled: item.isEnabled,
            };

            styleList.push(items);
          }
        });
        styleList.sort((a, b) => a.name - b.name)
        if (styleList.length > 1 || (styleList.length == 1 && styleList.some((item) => item.name != '00'))) {
          this.isHasSize = true;
        }
        this.styleList = [...new Set(styleList)];

        const skusLength = get(resultData, 'skus').length;
        if (skusLength < 2) {
          // this.isHasSize = true;
          // this.isHasStyle = true;
          const valueName = get(resultData, 'skus')[0].options.find(
            (i) => i.originCode === 'customSize',
          ).value.name;
          if (valueName == '00') {
            this.currentSkuCode = get(resultData, 'skus')[0].code;
          }
        }

        this.$nextTick(() => {
          // 添加最近浏览商品
          const recentBrowseItem = {
            code: resultData.code,
            images: resultData.images[0].url,
            title: resultData.title,
            salePrice: this.productData.salePrice || 0,
            skuCode: get(this.productData, 'skus[0].code'),
          };
          // 最近浏览存缓存
          const recentBrowseGoods = uni.getStorageSync('recentBrowseGoods') || [];
          const newRecentBrowseGoods = recentBrowseGoods.length
            && recentBrowseGoods.filter((item) => item.code !== this.code);
          if (newRecentBrowseGoods.length > 0) {
            newRecentBrowseGoods.unshift(recentBrowseItem);
            // 最多保留10条
            if (newRecentBrowseGoods.length > 10) {
              newRecentBrowseGoods.length--;
            }
            uni.setStorageSync('recentBrowseGoods', newRecentBrowseGoods);
          } else {
            const isHas = recentBrowseGoods.length
              && recentBrowseGoods.find((item) => item.code === this.code);
            if (!isHas) {
              recentBrowseGoods.unshift(recentBrowseItem);
              uni.setStorageSync('recentBrowseGoods', recentBrowseGoods);
            }
          }

          // 有数 访问pdp上报
          this.$sr.track('browse_sku_page', {
            sku: {
              sku_id: resultData.code, // 若商品无sku_id时，可传spu_id信息
              sku_name: resultData.title, // 若商品无sku_name时，可传spu_name信息
            },
            spu: {
              spu_id: resultData.code, // 若商品无spu_id时，可传sku_id信息
              spu_name: resultData.title, // 若商品无spu_name时，可传sku_name信息
            },
            sale: {
              original_price: this.productData.salePrice || 0, // 对接智慧零售入口必传
              current_price: this.productData.salePrice || 0, // 对接智慧零售入口必传
            },
            primary_image_url: resultData.images[0].url,
          });
        });
        uni.hideLoading();
      } catch (e) {
        console.log(e);
      }
    },
    async handleGetUserUnionId (e, params) {
      if (this.isDisabled) return;
      this.isDisabled = true;
      const { type } = e.target.dataset;
      if (!this.isMemberLogin || !this.isAuthorizeInfo) {
        uni.navigateTo({
          url: '/subPackages/login/pages/login/index',
        });
      } else {
        this.buyCommonFunc({
          userInfo: uni.getStorageSync(WX_INFO),
          type,
          params,
        });
      }
    },
    // 公共函数
    buyCommonFunc ({
      userInfo, type, params, encryptInfo,
    } = {}) {
      if (!this.isMemberLogin || !this.isAuthorizeInfo) return;
      if (type === BTN_TYPE.BUY_NOW) {
        this.handleShopBuyNow(this.currentSkuCode);
      } else if (type === BTN_TYPE.ADD_CURRENT || type === BTN_TYPE.ADD_ALL) {
        // 推荐模块的添加购物袋
        this.handleAddShopCart(params);
      } else {
        this.handleAddShopCart([{ skuCode: this.currentSkuCode, quantity: 1 }]);
      }
    },
    // 加入购物袋
    async handleAddShopCart (params) {
      if (!this.currentSkuCode) {
        uni.showToast({
          title: this.isHasSize ? '请选择尺寸' : '请选择款式',
          icon: 'none',
        });
        setTimeout(() => {
          this.isDisabled = false;
        }, 2000);
        return;
      }
      try {
        const formatParams = params;
        const res = await addShopCartApi(formatParams);
        await this.queryCartInfo();
        const errors = get(res, 'errors[0]');
        if (errors && (errors.message || errors.code)) {
          const messages = errors.message.indexOf('库存') != -1
            ? '库存不足'
            : '超过最大购买数量';
          uni.showToast({
            title: messages,
            icon: 'none',
          });
        } else {
          this.addSuccess();
          // 有数 加购上报
          this.$sr.track('add_to_cart', {
            action_type: 'append_to_cart',
            sku: {
              sku_id: this.currentSkuInfo.code,
              sku_name: this.productData.title,
            },
            spu: {
              spu_id: this.productData.code, // 若商品无spu_id时，可传sku_id信息
              spu_name: this.productData.title, // 若商品无spu_name时，可传sku_name信息
            },
            sale: {
              original_price: this.currentSkuInfo.salePrice.amount || 0,
              current_price: this.currentSkuInfo.salePrice.amount || 0,
            },
            sku_num: 1,
          });
        }
        setTimeout(() => {
          this.isDisabled = false;
        }, 1000);
      } catch (e) { }
    },

    // 立即购买
    handleShopBuyNow (currentSkuCode) {
      if (!currentSkuCode) {
        uni.showToast({
          title: this.isHasSize ? '请选择尺寸' : '请选择款式',
          icon: 'none',
        });
        setTimeout(() => {
          this.isDisabled = false;
        }, 2000);
        return;
      }
      const orderInfo = {
        orderLines: [
          {
            spuCode: this.code,
            skuCode: currentSkuCode,
            quantity: 1,
          },
        ],
      };
      uni.setStorageSync(ORDER_INFO, orderInfo);
      uni.navigateTo({
        url: '/subPackages/checkout/pages/index',
      });
    },

    addSuccess () {
      this.isAddSuccess = true;
      setTimeout(() => {
        this.isAddSuccess = false;
      }, 3000);
    },
    handleArrivalNotice () {
      if (this.isDisabled) return;
      this.isDisabled = true;
      if (!this.isMemberLogin || !this.isAuthorizeInfo) {
        uni.navigateTo({
          url: '/subPackages/login/pages/login/index',
        });
      } else {
        if (!this.currentSkuCode) {
          uni.showToast({
            title: this.isHasSize ? '请选择尺寸' : '请选择款式',
            icon: 'none',
          });
          setTimeout(() => {
            this.isDisabled = false;
          }, 2000);
          return;
        }
        this.wxSubscribe({
          type: TYPE_CODE.ARRIVAL_NOTICE,
          keyWord: this.currentSkuCode,
          isSubscribed: get(this.currentSkuInfo, 'subscribed'),
        }).then((res) => {
          this.currentSkuInfo.subscribed = true;
        });
        setTimeout(() => {
          this.isDisabled = false;
        }, 1000);
      }
    },
    handleContact () {
      // 点击客服
    },

    // 客服返回
    bindContact (e) { },
    // 跳购物袋
    toCart () {
      uni.reLaunch({
        url: '/pages/shoppingCar/index',
        success: () => {
          this.setTabSelected(2);
        },
      });
    },

    swiperImgChange (e) {
      this.currentIndex = e.detail.current;
    },
    swiperTransition () {
      // 判断是否有视频
      // if (this.videoTag[0]) {
      //   this.pause()
      // }
    },
    /**
     * 轮播点击
     */
    swiperClick (pic, index) {
      uni.previewImage({
        current: index,
        indicator: 'number',
        urls: this.productData.images.map((i) => i.url),
      });
    },
    play () {
      this.videoContext.play();
      this.paused = false;
    },
    pause () {
      this.videoContext.pause();
    },
    vplay (e) { },
    vpause (e) { },
    // 尺码指南
    sizeGuideClick () {
      this.sizeGuideShow = true;
      this.isLeftArrow = false;
      this.dialog.show = false
    },
    clickClose () {
      this.sizeGuideShow = false;
      this.isLeftArrow = true;
    },
    openDialog (type) {
      if (type === 'size') {
        this.dialog = {
          value: this.dialog.value,
          show: true,
          type,
          data: this.sizeList,
        }
      } else if (type === 'color') {
        this.dialog = {
          value: this.dialog.value,
          show: true,
          type,
          data: this.styleList,
        }
      } else {
        this.dialog.show = false
        this.dialog.data = false
        this.dialog.type = null
      }
    },
    // 选择尺寸
    bindPickerChange (e) {
      // console.log('picker发送选择改变，携带值为1', e, e.detail.value);
    },
    changeDialog (e) {
      const index = e.detail.value
      this.dialog.value = index
    },
    changeInput (index) {
      const e = this.dialog.data[index]
      this.currentSkuCode = e.code;
      let currentSku = ''
      if (this.sizeList.length) {
        currentSku = this.sizeList.find((i) => i.code === e.code);
      } else {
        currentSku = this.styleList.find((i) => i.code === e.code);
      }
      this.isSaleOut = !(currentSku.inventory > 0)
      this.openDialog()
    },
  },
  filters: {
    formatMoney (val) {
      if (val) {
        return priceFormat(val);
      }
      return '0';
    },
  },
  onShareAppMessage (res) {
    return {
      title: `${this.productData.title}` || 'TASAKI塔思琦线上旗舰店',
      path: `subPackages/pdp/pages/pdp/index?code=${this.code}`,
      imageUrl: get(this.productData, 'images[0].url'),
      success () { },
    };
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';

</style>
