<template>
  <view class="picture-content" v-if="showShareBox" catchtouchmove="ture">
    <view :class="['picture-image', isIpX ? 'pictureIsIpx' : '']">
      <image
        class="image-box"
        v-if="infos.activity"
        :src="pictureShow ? presellSharePictureX : presellSharePictureN"
        mode="widthFix"
      ></image>
      <view :class="['products-content', isIpX ? 'isNormolProductX' : '']" v-else>
        <view class="top-box">
          <image class="product-contentImage" :src="get(infos, 'images[0].url')" mode="aspectFill"></image>
          <view class="content-info">
            <view class="info-title subTitle">{{ infos.productAttribute }}</view>
            <view class="info-title">{{ infos.subTitle || '' }}</view>
            <view class="info-line"></view>
            <view class="info-content">tasaki</view>
            <view class="info-content">{{ infos.title }}</view>
          </view>
          <image
            class="logo-box"
            :src="require('../../assets/images/tasaki.png')"
          ></image>
        </view>
        <view class="productCode-box">
          <view class="letf-boxCode">
            <view class="margin">长按识别二维码</view>
            <view class="code-title">即可奢享</view>
          </view>
          <view class="image-box">
            <image class="right-imageCode" :src="QRcode"></image>
          </view>
        </view>
      </view>
    </view>
    <view
      :class="['picture-button', isIpX ? 'buttonIsIpx' : '']"
      @tap="savePicture"
      v-if="isAuthSaveImage"
      >点击此处 保存图片至相册</view
    >
    <button
      :class="['picture-button', isIpX ? 'buttonIsIpx' : '']"
      v-else
      open-type="openSetting"
      @opensetting="openSetting"
      plain="true"
    >
      点击此处 保存图片至相册
    </button>

    <painter @imgOK="onImgOk" @imgErr="onImgErr" widthPixels="1000" :palette="painterJson" />
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import utils from '../../utils/utils';
import { get } from '../../utils/utilityOperationHelper'
import handlePainterJson from './poster';
import { QR_CODE_SIGN, ENCODE_SPLIT_SIGN } from '../../constants/share'
import { reportWXAnalytics } from '../../utils/share'

export default {
  props: {
    showShareBox: {
      type: Boolean,
      default: false,
    },
    infos: Object,
  },
  data() {
    return {
      isIpX: utils.isIpx(),
      QRcode: '',
      canvasId: 'shareImgDownload',
      pictureShow: false,
      isAuthSaveImage: true,
      saveImageStatus: false,
      imagePath: '',
      activeSave: false,
    };
  },
  watch: {
    showShareBox: {
      handler(newVal) {
        newVal && (reportWXAnalytics({ userInfo: this.guideInfo, url: 'pages/pdp/index', spuCode: this.infos.code }))
      },
      immediate: true,
    },
  },
  async mounted() {
    try {
      const urlInfo = {
        api: 'https://la-prairie.baozun.com/wechat/qrCode',
        params: `page=${encodeURIComponent('pages/pdp/index')}&width=300&scene=${this.infos.code}${QR_CODE_SIGN}`,
      }
      let url = `${urlInfo.api}?${urlInfo.params}`
      // 企业分享
      if (this.guideInfo && this.guideInfo.userId) {
        url += `${ENCODE_SPLIT_SIGN}${[this.guideInfo.userId, this.guideInfo.storeCode].join(ENCODE_SPLIT_SIGN)}`
      }
      uni.downloadFile({
        url,
        success: ({ tempFilePath }) => {
          this.QRcode = tempFilePath
        },
      })
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    ...mapGetters('qy', ['qyUserInfo', 'guideInfo']),
    painterJson() {
      return handlePainterJson({
        ...this.infos,
        qrcodeImg: this.QRcode,
      });
    },
  },
  methods: {
    get,
    async savePicture() {
      this.saveImage();
    },
    async openSetting({ detail }) {
      if (this.saveImageStatus) return;
      if (detail.authSetting['scope.writePhotosAlbum']) {
        this.saveImageStatus = true;
        this.saveImage();
      }
    },
    async saveImage() {
      if (!this.imagePath) {
        uni.showLoading({ title: '图片生成中...' })
        this.activeSave = true;
        return
      }

      uni.saveImageToPhotosAlbum({
        filePath: this.imagePath,
        success: () => {
          uni.showModal({
            title: '存图成功',
            content: '图片成功已保存至相册',
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#72B9C3',
            success(info) {
              if (info.confirm) {
                console.log('用户点击确定');
              }
            },
          });
          this.isAuthSaveImage = true;
          // this.showShareBox = false;
          this.showFooterShare = false;

          this.$emit('sccuessSave');
        },
        fail: () => {
          // 用户拒绝授权
          this.isAuthSaveImage = false;
        },
      });
      setTimeout(() => {
        this.saveImageStatus = false;
      }, 2000);

      uni.hideLoading();
    },
    onImgOk(e) {
      this.imagePath = e.detail.path;
      console.log('图片生成成功', e)
      console.log('this.activeSave', this.activeSave)
      if (this.activeSave) {
        this.saveImage();
        this.activeSave = false;
      }
    },
    onImgErr(e) {
      console.log('图片生成失败', e)
      uni.hideLoading();

      uni.showToast({
        title: '图片生成失败，请稍后再试',
        icon: 'none',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
