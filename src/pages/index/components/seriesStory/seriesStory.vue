// 品牌故事
<template name="seriesStory">
  <view class="series-story-components">
    <view class="series-story">
      <view class="title">
        <text class="main-title">品牌介绍</text>
      </view>
      <video id="series-story-video" class="series-story-video"
        src="https://res-tasaki.baozun.com/static/images/home/3.MP4" :loop="false" :controls="true" object-fit="cover"
        :muted="isMuted" :show-mute-btn="true" :show-center-play-btn="true" :show-play-btn="true"
        :show-fullscreen-btn="true" play-btn-position="center" :enable-progress-gesture="false"
        @fullscreenchange='fullscreenchange'>
      </video>
      <!-- <image class="series-story-image" :src="'http://res-tasaki.baozun.com/static/images/home/text.jpg'" mode="widthFix" :lazy-load="true"/> -->
      <view class="font-content">
        <text>
          ALAÏA品牌源自其创始人Azzedine Alaia的名
        </text>
        <text>
          字，Azzedine Alaia是上世纪80年代“超紧身性
        </text>
        <text>
          感”风潮的创始人
        </text>
      </view>
      <view class="home-more-btn">
        <customButton :btnWidth="480" :btnHeight="80" className="transparent">即刻探索</customButton>
      </view>
    </view>
  </view>
</template>
<script>
  import ComTitle from '../comTitle/comTitle';
  import customButton from '@/components/button/normal.vue';
  export default {
    name: 'seriesStory',
    components: {
      ComTitle,
      customButton
    },
    props: {
      viewScrollTop: {
        type: Number,
        value: 0
      },
      isPause: {
        type: Boolean,
        default: false,
      }
    },
    watch: {
      isPause: {
        handler(n) {
          console.log('series-pause', n);
          const that = this;

          this.videoContext = null
          this.videoContext = wx.createVideoContext('series-story-video', that)

          if (n) {
            if (this.videoContext) {
              this.videoContext.pause();
            }
          }
        }
      }
    },
    data() {
      return {
        isFullScreen: false,
        scrollTop: '',
        videoContext: "",
      };
    },
    methods: {
      // 全屏状态改变
      fullscreenchange(e) {
        console.log("fullscreenchange", e)
        this.isFullScreen = e.detail.fullScreen;
        if (this.isFullScreen) {
          this.scrollTop = this.viewScrollTop;

        }
        this.$emit('fullscreenchange', this.scrollTop, this.isFullScreen)
        // tab-bar
      },

    },
  };
</script>

<style lang="scss" scoped>
  $mainColor: #e3f0ea;
  $color: #1D1D1D;

  // 品牌故事
  .series-story-components {
    background-color: #FFFFFF;

    .series-story {
      .title {
        padding: 118rpx 0 44rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: $color;

        .main-title {
          font-size: 48rpx;
          line-height: 66rpx;
          letter-spacing: 2rpx;
          font-weight: bold;
        }

        .subtitle {
          margin-top: 14rpx;
          font-size: 28rpx;
          line-height: 40rpx;
          letter-spacing: 2rpx;
        }
      }

      // padding-bottom: 100rpx;
      .series-story-image,
      .series-story-video {
        width: calc(100vw);
        vertical-align: middle;
      }

      .series-story-content {
        padding: 34rpx 50rpx 0;
        font-size: 24rpx;
        color: #616161;
        line-height: 48rpx;
        text-align: center;
      }
      .font-content{
        padding: 60rpx 0 52rpx;
        text{
          display: block;
          font-size: 28rpx;
          font-weight: bold;
          line-height: 40rpx;
          color: $color;
          text-align: center;
        }
      }
    }
  }
</style>
<style lang="scss">
  .series-story-video {
    position: relative;
    z-index: 999999;
  }
</style>
