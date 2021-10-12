<template name="homeHeadSwiper">
  <view class="home-head-swiper">
    <swiper class="swiper"  :autoplay="parentCurrent === 0 && swiperAutoplay" :circular="true" @change="swiperChange">
      <block v-for="(swiperItem,swiperIndex) in bannerList" :key="swiperIndex">
        <swiper-item class="home-head-swiper-item" :class="swiperItem.name == '2-W' ? 'fontWhite' :''">
          <!-- 视频 -->
          <block v-if="swiperItem.videoId">
            <view class="home-head-swiper-video">
              <video class="video-content" :id="'myVideo'+swiperIndex"  :src="swiperItem.videoId" :loop="false" :autoplay="swiperItem.picDes === 'auto' ? true : false" :controls="false"   object-fit ="cover" :muted="swiperItem.isMuted" :show-mute-btn="true" :show-center-play-btn="false" :show-play-btn="false" :show-fullscreen-btn="false" play-btn-position="center" :enable-progress-gesture="false" @ended="videoEnded"></video>
            </view>
            <view class="play-btn" v-if="isShowPlayBtn">
              <text class="icon-font icon-icon-bofang" @click="playVideo(swiperIndex)" :class="white? 'white':''"></text>
            </view>
            <text class="icon-font yingliang icon-bofangguanbi"  :class="white? 'white':''" @click="mutedChange(swiperItem)" v-if="swiperItem.isMuted"></text>
            <text class="icon-font yingliang icon-bofang" :class="white? 'white':''"  @click="mutedChange(swiperItem)" v-if="!swiperItem.isMuted"></text>
          </block>
          <!-- 图片 -->
          <block v-else>
            <image class="home-head-swiper-img" v-if="swiperItem.picLink" :src="swiperItem.picLink" mode="aspectFill" :lazy-load="true" />
          </block>
          <!--  -->

          <view class="home-head-swiper-other">
            <view class="home-head-swiper-title" v-if="swiperItem.title"><text>{{swiperItem.title}}</text></view>
            <customButton class="home-head-swiper-btn" @click="goPlp(swiperItem.title,swiperItem.url)" :btnWidth="280" :btnHeight="80" :className="swiperItem.name == '2-W'? 'whiteBtn' :'transparent'">{{swiperItem.btn.text || '探索此系列'}}</customButton>
          </view>

        </swiper-item>
      </block>
    </swiper>
    <!-- 滚动条 -->
    <view class="view-dost" :class="white? 'white-dost':''" v-if="bannerList.length > 1&&isShowDost">
      <view class="swiper-dots-warp">
        <view class="swiper-dots"  :style="{ width:dotsWidth + 'px',left:dotsLeft + 'px' }"></view>
      </view>
    </view>
    <view class="down-arrow" v-if="bannerList.length > 0&&isShowDost">
      <text class="icon-font icon-icon-xia" :class="white? 'white-arrow':''"></text>
    </view>
  </view>
</template>

<script>
import customButton from '@/components/button/normal.vue';

export default {
  name: 'homeHeadSwiper',
  components: {
    customButton,
  },
  props: {
    parentCurrent: {
      type: Number,
      default: 0,
    },
    homeHeadSwiperList: {
      type: Array,
      default: () => [],
    },
    pageIsShow: {
      type: Boolean,
      default: false,
    },
    isPause: {
      type: Boolean,
      default: false,
    },
    isShowDost: {
      type: Boolean,
      default: true,
    },

  },
  watch: {
    parentCurrent: {
      immediate: true,
      handler(n, o) {
        console.log('parentCurrent', n);
      },
    },
    homeHeadSwiperList: {
      immediate: true,
      deep: true,
      handler(n, o) {
        console.log('homeHeadSwiperList', n);
        const ts = /\.mov/g;
        if (n && n.length > 0) {
          n.forEach((element) => {
            if (/\.mov/g.test(element.picLink) || /\.mp4/g.test(element.picLink)) {
              console.log('视频：', element.picLink)
              element.videoId = element.picLink;
              element.isMuted = element.subTitle === 'mute'
            }
          });
          this.bannerList = JSON.parse(JSON.stringify(n));
          this.swiperAutoplay = !this.bannerList[0].videoId;
          this.white = this.bannerList[0].name === '2-W';
          this.isShowPlayBtn = this.bannerList[0].picDes !== 'auto';
        } else {
          this.bannerList = [];
        }
      },
    },
    pageIsShow: {
      immediate: true,
      handler(n) {
        console.log('pageIsShow', n);
        this.swiperAutoplay = n;
        if (n) { //
          if (this.videoContext) {
            this.videoContext.play;
          }
        } else if (this.videoContext) {
          this.videoContext.pause();
        }
      },
    },
    isPause: {
      handler(n) {
        console.log('isPause', n);
        const that = this;
        this.swiperAutoplay = !n;

        this.videoContext = null
        this.videoContext = wx.createVideoContext(`myVideo${this.currentIndex}`, that)

        if (n) {
          if (this.videoContext) {
            this.videoContext.pause();
            this.isShowPlayBtn = true;
          }
        }
      },
    },
  },
  data() {
    return {
      ktxStatusHeight: getApp().globalData.ktxStatusHeight, // 头部的高度，用于设置样式padding-top
      bannerList: [], // 轮播图数据
      currentIndex: 0, // 轮播图所属下标
      swiperAutoplay: true, // 轮播图是否滚动
      white: false,
      isShowPlayBtn: false,
      isMuted: false, // 是否静音播放
      videoContext: '',
    };
  },
  computed: {
    dotsWidth() {
      return this.bannerList.length > 0 ? 200 / this.bannerList.length : 200;
    },
    dotsLeft() {
      return this.bannerList.length > 0 ? 200 / this.bannerList.length * this.currentIndex : 0;
    },

  },
  methods: {
    swiperChange(e) {
      console.log('swiperChange ====>', e, this.currentIndex);
      const that = this;
      if (this.bannerList[this.currentIndex].videoId) {
        this.videoContext = null
        this.videoContext = wx.createVideoContext(`myVideo${this.currentIndex}`, that)
        this.videoContext && this.videoContext.pause();
        this.swiperAutoplay = true;
        this.isShowPlayBtn = true;
      } else {
        this.videoContext = null;
      }

      this.currentIndex = e.detail.current;

      if (this.bannerList[this.currentIndex].videoId) {
        this.videoContext = null
        this.videoContext = wx.createVideoContext(`myVideo${this.currentIndex}`, that)
        if (this.bannerList[this.currentIndex].picDes === 'auto') {
          this.videoContext && this.videoContext.play();
          this.swiperAutoplay = false;
          this.isShowPlayBtn = false;
        }
      } else {
        this.videoContext = null;
      }
      this.white = this.bannerList[this.currentIndex].name === '2-W';
      this.$emit('swiperChange', this.bannerList[this.currentIndex]);
    },
    // 视频播放完毕，轮播
    videoEnded(e) {
      console.log('播放完毕');
      this.isShowPlayBtn = true;
      this.swiperAutoplay = true;
    },
    playVideo(index) {
      console.log(index);
      const that = this;
      let videoContext = null
      videoContext = wx.createVideoContext(`myVideo${index}`, that)
      videoContext && videoContext.play();
      this.swiperAutoplay = false;
      this.isShowPlayBtn = false;
    },
    // 去plp页面
    goPlp(name, url) {
      console.log('goPlp', url);
      if (url) {
        uni.navigateTo({
          url: `/subPackages/plp/pages/plp/index?name=${name}&code=${url}&img=`,
        })
      }
    },
    mutedChange(swiperItem) {
      // this.isMuted = !this.isMuted;
      this.$set(swiperItem, 'isMuted', !swiperItem.isMuted)
    },
  },
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
$transitionAll: all .8s;
// 首页顶部swiper
.home-head-swiper {
  position: relative;
  width: 100%;
  height: calc(100vh - 112rpx - var(--safe-area-inset-bottom));
  .swiper{
    width: 100%;
    height: 100%;
    .home-head-swiper-item{
      position: relative;
      width: 100%;
      height: 100%;
      &.fontWhite{
        .home-head-swiper-other{
          color: #fff;
          .normal{
            .default-btn.btn{
              border-color:#fff !important;
              color: #fff !important;

            }
          }
        }
      }
      .home-head-swiper-img {
        position: relative;
        height: 100%;
        width: 100%;
        z-index: 1;
      }
      .home-head-swiper-video {
        position: relative;
        height: 100%;
        width: 100%;
        z-index:-1 !important;
        .video-content{
          height: 100%;
          width: 100%;
        }
      }
      .home-head-swiper-other {
        position: absolute;
        bottom: 182rpx;
        width: 100%;
        height: 190rpx;
        color: #1d1d1d;
        text-align: center;
        z-index: 10;
        .home-head-swiper-title {
          font-size: 44rpx;
          line-height: 66rpx;
          letter-spacing: 1px;
          margin-bottom: 40rpx;
        }
        .home-head-swiper-btn {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }

   // 滚动条
  .view-dost {
    position: absolute;
    bottom: 120rpx;
    z-index: 10;
    width: 100%;
    margin-top: 80rpx;
    text-align: center;
    word-wrap: break-word;

    .swiper-dots-warp {
      position: relative;
      width: 200px;
      height: 2px;
      margin: 0 auto;
      transform: scaleY(.5);
      background: #d8d8d8;

      .swiper-dots {
        position: absolute;
        top: 50%;
        left: 0;
        width: 32px;
        height: 3px;
        transition: $transitionAll;
        transform: translateY(-50%);
        text-align: center;
        background: #1d1d1d;
      }
    }
    &.white-dost{
      .swiper-dots-warp{
        .swiper-dots{
          background: #fff;
        }
      }

    }
  }
  .down-arrow{
    width: 100%;
    height: 20rpx;
    position: absolute;
    bottom: 36rpx;
    color: #1d1d1d;
    line-height: 20rpx;
    font-size: 18rpx;
    text-align: center;
    .icon-font{
      height: 20rpx;
      &.white-arrow{
        color: #fff;
      }
    }

  }
  .play-btn{
    width: 100%;
    position: absolute;
    top: 50%;
    margin: -27px 0 0 8px;
    color: #1d1d1d;
    text-align: center;
    z-index: 10;
    .icon-font{
      font-size:100rpx;
    }
  }
  .white{
    color: #fff !important;
  }
  .yingliang{
    position: absolute;
    top: 200rpx;
    right: 32rpx;
    font-size: 36rpx;
  }
}
</style>
