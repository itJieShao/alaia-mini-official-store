<template>
  <div class="container">
    <!-- 分享图标 -->
    <view class="share-content" @tap="openShare">
      <view class="share-box">
        <!-- <image
          class="share-image"
          :src="require('../../assets/images/icon/share-product.png')"
        ></image> -->
      </view>
    </view>

    <view :class="['footer-share', isIpX ? 'isIpX' : '']" v-if="showFooterShare">
      <view class="top-content" @tap="closeCurrentBox"></view>
      <view class="bottom-content">
        <button class="share-content-left" open-type="share">
          <!-- <image
            class="content-image"
            :src="require('../../assets/images/icon/wechat-box.png')"
          ></image> -->
          <view class="content-text">分享给好友</view>
        </button>
        <button class="share-content-left" @tap="openSharePicture">
          <!-- <image
            class="content-image"
            :src="require('../../assets/images/icon/wechat-content.png')"
          ></image> -->
          <view class="content-text">分享至朋友圈</view>
        </button>
      </view>
    </view>

    <shareImage :infos="infos" :showShareBox="showShareBox" @sccuessSave="sccuessSave"/>
  </div>
</template>

<script>
import utils from '../../utils/utils';
import shareImage from './shareImage';
import { trackerClick, EVENT_TYPE, SCREEN_NAME } from '../../utils/ga'

export default {
  props: {
    infos: Object,
  },
  data() {
    return {
      isIpX: utils.isIpx(),
      showFooterShare: false,
      pictureImg: '',
      showShareBox: false,
      presellData: {},
    };
  },
  methods: {
    openShare() {
      this.showFooterShare = true;

      // 埋点
      trackerClick({ ...EVENT_TYPE.PRODUCT_DETAIL_SHARE, screenName: SCREEN_NAME.PRODUCT_DETAIL })
    },
    closeCurrentBox() {
      this.showFooterShare = false;
    },
    // 打开分享图
    async openSharePicture() {
      this.showShareBox = true;
      // 埋点
      trackerClick({ ...EVENT_TYPE.PRODUCT_DETAIL_SHARE, label: 'Share-分享至朋友圈', screenName: SCREEN_NAME.PRODUCT_DETAIL })
    },
    sccuessSave() {
      this.showShareBox = false;
      this.closeCurrentBox();
      trackerClick({ ...EVENT_TYPE.PRODUCT_DETAIL_SHARE, label: 'Share-分享至朋友圈-保存', screenName: SCREEN_NAME.PRODUCT_DETAIL })
    },
  },
  components: { shareImage },
};
</script>

<style lang="scss" scoped>
@import "./index";
</style>
