//  品牌故事
<template name="seriesStory">
  <view class="series-story-components">
    <view class="series-story">
      <com-title title="品牌故事"></com-title>
      <!-- <image class="series-story-image" :src="'https://res-tasaki.baozun.com/static/images/home/series-story.jpg'" mode="widthFix" :lazy-load="true"/> -->
      <video
        id="series-story-video"
        class="series-story-video"
        src="https://res-tasaki.baozun.com/static/images/home/3.MP4"
        :loop="false"
        :controls="true"
        object-fit ="cover"
        :muted="isMuted"
        :show-mute-btn="true"
        :show-center-play-btn="true"
        :show-play-btn="true"
        :show-fullscreen-btn="true"
        play-btn-position="center"
        :enable-progress-gesture="false"
        @fullscreenchange='fullscreenchange'
      >
      </video>
      <image class="series-story-image" :src="'http://res-tasaki.baozun.com/static/images/home/text.jpg'" mode="widthFix" :lazy-load="true"/>
      <!-- <view class="series-story-content">国际珠宝品牌TASAKI塔思琦创立于1954年，珍珠和钻石是品牌引以为傲的两大核心元素。</view>
      <view class="series-story-content">60多年来，TASAKI塔思琦始终坚持对品质的严格把控、工艺技巧的不懈追求、以及对美的独特领悟，以此实现独具创意的珠宝臻品。</view> -->
    </view>
  </view>
</template>
<script>
import ComTitle from '../comTitle/comTitle';

export default {
  name: 'seriesStory',
  components: {
    ComTitle,
  },
  props: {
    viewScrollTop:{
      type:Number,
      value:0
    },
    isPause:{
      type:Boolean,
      default:false,
    }
  },
  watch:{
  isPause:{
      handler(n){
          console.log('series-pause', n);
          const that = this;

          this.videoContext = null
          this.videoContext = wx.createVideoContext('series-story-video', that)

          if(n){
            if(this.videoContext){
              this.videoContext.pause();
            }
          }
      }
    }
  },
  data() {
    return {
      isFullScreen:false,
      scrollTop:'',
      videoContext:"",
    };
  },
  methods: {
    // 全屏状态改变
    fullscreenchange(e){
      console.log("fullscreenchange",e)
      this.isFullScreen = e.detail.fullScreen;
      if(this.isFullScreen){
        this.scrollTop = this.viewScrollTop;

      }
      this.$emit('fullscreenchange', this.scrollTop,this.isFullScreen)
      // tab-bar
    },

  },
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
// 品牌故事
.series-story-components {
  .series-story {
    // padding-bottom: 100rpx;
    .series-story-image,.series-story-video {
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
  }
}
</style>
<style lang="scss">
  .series-story-video{
    position: relative;
    z-index: 999999;
  }
</style>
