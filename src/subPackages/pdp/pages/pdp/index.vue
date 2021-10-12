<template>
  <div class="product-content" :style="{ 'padding-top': computedHeight }">
    <custom-nav-bar :head-border="false" :left-arrow="isLeftArrow" />
    <div class="wrapper">
      <div class="product-banner-content">
        <div class="pdp-swiper" v-if="productData.images.length">
          <swiper
            class="pdp-swiper-content"
            @change="swiperImgChange"
            @transition="swiperTransition"
            :current="currentIndex"
          >
            <!-- <block v-if="videoTag[0]">
              <swiper-item class="swiper-item">
                <video
                  id="videos"
                  class="video"
                  @play="vplay"
                  @pause="vpause"
                  :src="videoTag[0].picUrl"
                  :controls="true"
                  :show-play-btn="false"
                  :enable-play-gesture="true"
                  :enable-progress-gesture="false"
                  @click="play"
                >
                  <image
                    class="play"
                    v-show="paused"
                    :src="playBtn"
                    mode="widthFix"
                  />
                  <image
                    class="poster"
                    v-show="paused"
                    :src="
                      videoTag[0].poster &&
                      videoTag[0].poster +
                        '?x-oss-process=image/resize,m_pad,w_' +
                        $pixelRatio(300) +
                        ',h_' +
                        $pixelRatio(450)
                    "
                    mode="widthFix"
                  />
                </video>
              </swiper-item>
            </block> -->
            <block v-for="(pic, index) in productData.images" :key="index">
              <swiper-item class="swiper-item">
                <image
                  @click="swiperClick(pic.url, index)"
                  :src="imgUrlReplace(pic.url, 375, 375)"
                  mode="widthFix"
                  class="imgs"
                  :lazy-load="true"
                />
              </swiper-item>
            </block>
          </swiper>
        </div>
        <div class="view-dost" v-if="productData.images.length">
          <div
            class="dots-item"
            :class="[index === currentIndex ? 'dots-item-active' : '']"
            v-for="(item, index) in productData.images"
            :key="index"
          ></div>
        </div>
      </div>
      <div
        class="product-info-content"
        :class="[!isHasSize && !isHasStyle ? 'box-margin' : '']"
      >
        <div class="title">{{ productData.title || "" }}</div>
        <div class="sub-title" v-if="productData.subTitle">
          {{ productData.subTitle }}
        </div>
        <div class="sku">{{ code }}</div>
        <template v-if="productData.materialList.length">
          <div
            class="attr"
            v-for="(item, index) in productData.materialList"
            :key="index"
          >
            {{ item }}
          </div>
        </template>
        <div class="share">
          <button open-type="share">
            <text class="icon-font icon-icon-fenxiang"></text>
            <div class="text">分享</div>
          </button>
        </div>
        <div class="price" v-if="productData.salePrice > 0">
          ￥{{ productData.salePrice | formatMoney }}
        </div>
      </div>
      <div class="product-size-content" v-if="isHasSize">
        <div class="picker-wrap">
          <sizePicker
            class="size-picker"
            placeholder="请选择合适的尺寸"
            :range="sizeList"
            @change="bindPickerChange"
            @input="changeInput"
          ></sizePicker>
        </div>
        <div class="size-guide" @click="sizeGuideClick()">
          <div class="text">尺寸指南</div>
        </div>
      </div>
      <div class="product-size-content" v-if="isHasStyle">
        <div class="picker-wrap-style">
          <sizePicker
            class="size-picker"
            placeholder="请选择款式"
            :range="styleList"
            @change="bindPickerChange"
            @input="changeInput"
          ></sizePicker>
        </div>
      </div>
      <div
        class="product-details-content"
        v-if="productData.description.length"
      >
        <div
          class="details-item"
          v-for="(item, index) in productData.description"
          :key="index"
        >
          <image :src="item.url" mode="widthFix" :lazy-load="true" />
        </div>
      </div>
      <recently-like-products />
    </div>
    <div class="pdp-buy-fixed">
      <div class="pdp-buy-content">
        <div class="add-success-content" v-if="isAddSuccess">
          <div class="text">
            <text class="icon-font icon-icon-chenggong2"></text>已成功加入购物袋
          </div>
          <div class="btn" @click.stop="toCart"><text>进入购物袋</text></div>
        </div>
        <div class="service-content">
          <button
            class="service-btn"
            open-type="contact"
            @click="handleContact"
            @contact="bindContact"
          >
            <image
              class="imgs"
              mode="widthFix"
              src="https://res-tasaki.baozun.com/static/images/icon-service-active.png"
            ></image>
            <div class="text">客服</div>
          </button>
        </div>
        <div class="cart-content">
          <div class="cart-btn" @click.stop="toCart">
            <div class="cart-main">
              <image
                class="imgs"
                mode="widthFix"
                src="https://res-tasaki.baozun.com/static/images/icon-cart-active.png"
              ></image>
              <div class="cart-num" v-if="cartAmount && cartAmount > 0">
                {{ cartAmount }}
              </div>
            </div>
            <div class="text">购物袋</div>
          </div>
        </div>
        <div v-if="isSaleOut || isOffShelf" class="arrival-notice">
          <button
            v-if="isSaleOut && !isOffShelf"
            class="btn btn-black-white"
            @click="handleArrivalNotice"
          >
            到货通知
          </button>
          <button v-else class="btn btn-disabled">已下架</button>
        </div>
        <div class="buy-main" v-else>
          <button
            class="btn btn-black-white add-cart-btn"
            @click="handleGetUserUnionId"
            :data-type="BTN_TYPE.ADD_CART"
          >
            加入购物袋
          </button>
          <button
            class="btn btn-primary buy-now-btn"
            @click="handleGetUserUnionId"
            :data-type="BTN_TYPE.BUY_NOW"
          >
            立即购买
          </button>
        </div>
      </div>
    </div>
    <sizeGuide
      :size-guide-show="sizeGuideShow"
      @clickClose="clickClose"
    ></sizeGuide>
  </div>
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
import sizeGuide from './components/sizeGuide';

export default {
  name: 'Product',
  components: {
    RecentlyLikeProducts,
    sizeGuide,
    sizePicker,
  },
  mixins: [navBarHeight],
  data() {
    return {
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
    };
  },
  onLoad(options) {
    const { code, scene } = options;
    // try {
    //   // 埋点
    //   setTrackerParams(options);
    // } catch (error) {
    //   console.log(error, '埋点设置失败');
    // }
    if (code) {
      this.code = code;
    }
    if (scene) {
      const paramsArr = (scene || '').split(ENCODE_SPLIT_SIGN);
      this.code = paramsArr[0];
    }
    this.getProductData();
  },
  onShow() {
    const advertisingParams = uni.getStorageSync('advertisingParam') || this.advertisingParam
    console.log('advertisingParams>>>>', advertisingParams)
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
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  computed: {
    ...mapState('shoppingCart', ['cartAmount']),
    ...mapGetters('user', ['unionId']),
    ...mapState('globle', ['advertisingParam']),
    skus() {
      return get(this.productData, 'skus') || [];
    },
    currentSkuInfo() {
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
    // 调用广告
    async getRandom(gdt_vid) {
      console.log(111144);
      try {
        // const token = await this.getAccessToken()
        const currentPage = getCurrentPages()[getCurrentPages().length - 1]
        // console.log('tttttt>>>>', token)
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
    async getProductData() {
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
        console.log(
          !get(resultData, 'inventory') > 0,
          '<--售罄&下架-->',
          !get(resultData, 'onShelves'),
        );
        const images = get(resultData, 'images').filter(
          (i) => i.type !== 'FIGUREIMAGE',
        );
        const description = get(resultData, 'images').filter(
          (i) => i.type === 'FIGUREIMAGE',
        );
        const attributes = get(resultData, 'attributes').filter(
          (i) => i.name === '具体材质&尺寸',
        )[0].values[0].frontName;
        const attributesList = attributes.split('\n');
        const materialList = attributesList.length
          && attributesList.filter((i, index) => index !== 0);
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
        const sizeList = [];
        get(resultData, 'skus').map((item) => {
          const sizeName = get(item, 'options').find(
            (i) => i.originCode === 'customSize',
          );
          if (sizeName.value.name != '00') {
            const items = {
              code: item.code,
              name: sizeName.value.name, // get(item, 'options[0].value.name')
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
        console.log('sizeList--->', this.sizeList);

        const styleList = [];
        get(resultData, 'skus').map((item) => {
          const styleName = get(item, 'showAttrList').find(
            (i) => i.originCode === 'customSizeDesc',
          );
          if (styleName && styleName.attrValueList[0].frontName) {
            const items = {
              code: item.code,
              name: styleName.attrValueList[0].frontName, // get(item, 'options[0].value.name')
              inventory: item.inventory,
              isEnabled: item.isEnabled,
            };
            styleList.push(items);
          }
        });
        styleList.sort((a, b) => a.name - b.name)
        if (styleList.length > 1) {
          this.isHasStyle = true;
        }
        this.styleList = styleList;
        console.log('styleList--->', this.styleList);

        this.$nextTick(() => {
          console.log('productData--->', this.productData);
          // 添加最近浏览商品
          const recentBrowseItem = {
            code: resultData.code,
            images: resultData.images[0].url,
            title: resultData.title,
            salePrice: this.productData.salePrice || 0,
            skuCode: get(this.productData, 'skus[0].code'),
          };
          // console.log(recentBrowseItem, 'recentBrowseItem');
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
      // 埋点
      // trackerProductPageView(this.productData, SCREEN_NAME.PRODUCT_DETAIL);
    },
    async handleGetUserUnionId(e, params) {
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
    buyCommonFunc({
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
    async handleAddShopCart(params) {
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
        console.log('加购--->', params, errors);
        if (errors && (errors.message || errors.code)) {
          const messages = errors.message.indexOf('库存') != -1
            ? '库存不足'
            : '超过最大购买数量';
          uni.showToast({
            // title: errors.message,
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
      } catch (e) {
        console.log(e);
      }
      // ga埋点
      // const skuList = [];
      // [
      //   this.productData,
      //   ...(get(this.productData, 'recommends') || []),
      // ].forEach((product) => {
      //   skuList.push(
      //     ...(get(product, 'skus') || []).map((sku) => ({ ...product, ...sku })),
      //   );
      // });

      // trackerAddCart(
      //   skuList.filter((sku) => params.find((item) => item.skuCode === sku.code)),
      // );
    },

    // 立即购买
    handleShopBuyNow(currentSkuCode) {
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
      // 埋点
      // trackerProdctBuyNow(
      //   [
      //     {
      //       ...this.productData,
      //       ...((get(this.productData, 'skus') || []).find(
      //         (sku) => sku.code === currentSkuCode,
      //       ) || {}),
      //     },
      //   ],
      //   `${SCREEN_NAME.PRODUCT_DETAIL}——立即购买按钮`,
      // );
    },

    addSuccess() {
      this.isAddSuccess = true;
      setTimeout(() => {
        this.isAddSuccess = false;
      }, 3000);
    },
    handleArrivalNotice() {
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
    handleContact() {
      // 点击客服
      // ga埋点
      // trackerClick(EVENT_TYPE.PRODUCT_DETAIL_CUSTOMER_SERVICE);
    },

    // 客服返回
    bindContact(e) {},
    // 跳购物袋
    toCart() {
      uni.reLaunch({
        url: '/pages/shoppingCar/index',
        success: () => {
          this.setTabSelected(2);
        },
      });
    },
    /*
     * 轮播滑动
     * @params {object}
     * */
    swiperImgChange(e) {
      this.currentIndex = e.detail.current;
    },
    swiperTransition() {
      // 判断是否有视频
      // if (this.videoTag[0]) {
      //   this.pause()
      // }
    },
    /**
     * 轮播点击
     */
    swiperClick(pic, index) {
      uni.previewImage({
        current: index,
        indicator: 'number',
        urls: this.productData.images.map((i) => i.url),
      });
    },
    play() {
      this.videoContext.play();
      this.paused = false;
    },
    pause() {
      this.videoContext.pause();
    },
    vplay(e) {},
    vpause(e) {},
    // 尺码指南
    sizeGuideClick() {
      this.sizeGuideShow = true;
      this.isLeftArrow = false;
    },
    clickClose() {
      this.sizeGuideShow = false;
      this.isLeftArrow = true;
    },
    // 选择尺寸
    bindPickerChange(e) {
      // console.log('picker发送选择改变，携带值为1', e, e.detail.value);
    },
    changeInput(e) {
      // console.log('picker发送选择改变，携带值为2', e, this.sizeList);

      console.log('changeInput--->', e);
      this.currentSkuCode = e.code;
      let currentSku = ''
      if (this.sizeList.length) {
        currentSku = this.sizeList.find((i) => i.code === e.code);
      } else {
        currentSku = this.styleList.find((i) => i.code === e.code);
      }

      currentSku.inventory > 0
        ? (this.isSaleOut = false)
        : (this.isSaleOut = true);
    },
  },
  filters: {
    formatMoney(val) {
      if (val) {
        return priceFormat(val);
      }
      return '0';
    },
  },
  onShareAppMessage(res) {
    // ga埋点
    // const isButton = get(res, 'from') === 'button';
    // if (isButton) {
    //   trackerClick({
    //     ...EVENT_TYPE.PRODUCT_DETAIL_SHARE,
    //     label: 'Share-分享给好友',
    //     screenName: SCREEN_NAME.PRODUCT_DETAIL,
    //   });
    // }
    // 分享配置项
    return {
      title: `${this.productData.title}` || 'TASAKI塔思琦线上旗舰店',
      path: `subPackages/pdp/pages/pdp/index?code=${this.code}`,
      imageUrl: get(this.productData, 'images[0].url'),
      success() {
        // if (isButton) {
        //   trackerClick({
        //     ...EVENT_TYPE.PRODUCT_DETAIL_SHARE,
        //     label: 'Share-分享给好友-发送',
        //     screenName: SCREEN_NAME.PRODUCT_DETAIL,
        //   });
        // }
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
