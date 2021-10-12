  <!-- 首页产品轮播 -->
<template name="scrollBar">
  <view class="scroll-bar-box" v-if="menuTabs.length > 0">
    <scroll-view class="bar-list-view" scroll-x="true" :scroll-left="scrollLeft" :scroll-with-animation="true">
      <block v-for="(menuTab, index) in menuTabs" :key="index">
        <view class="bar-item" :id="`tabNum${index}`" @click="swichMenu(index,menuTab)">
          <view class="bar-item-act" :class="[currentTab == index ? 'bar-item-acted' : '']">
            <view class="bar-item-txt">{{ menuTab.name }}</view>
            <view class="bar-item-bottom">
              <view class="bar-item-bottom-color"></view>
            </view>
          </view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>
<script>

export default {
  name: 'scrollBar',
  components: {
  },
  props: {
    scrollBarList: {
      type: Array,
      default: () => [],
    },
    current: {
      type:Number,
      default:0
    }
  },
  watch: {
    scrollBarList: {
      immediate: true,
      deep: true,
      handler(n, o) {
        this.menuTabs = n;
      },
    },
    current:{
      handler(n, o) {
        this.currentTab = n;
         this.setScrollLeft(n);
      },
    }
  },
  data() {
    return {
      scrollLeft: 0,
      currentTab: 0,
      indicatorDots: true,
      menuTabs: [
        {
          name: 'balance 系列',
        },
        {
          name: 'refined rebellion 系列',
        },
        {
          name: 'danger 系列',
        },
        {
          name: 'refined rebellion 系列',
        },
      ],
    };
  },
  methods: {
    swichMenu(current, item) {
      this.currentTab = current;
      this.setScrollLeft(current);
      this.$emit('click', current, item)
    },
    async setScrollLeft(tabIndex) {
      let leftWidthSum = 0;
      const currentTab = await this.getDomData(`#tabNum${tabIndex}`);
      const winWidth = uni.getSystemInfoSync().windowWidth;
      for (let i = 0; i <= tabIndex; i++) {
        if (i < tabIndex) {
          const nowElement = await this.getDomData(`#tabNum${i}`);
          console.log('nowElement ===>', nowElement, nowElement.width);
          leftWidthSum = leftWidthSum + nowElement.width;
        }
      }
      console.log('leftWidthSum ===>', leftWidthSum)
      this.scrollLeft = leftWidthSum - winWidth / 2 + (currentTab.width / 2)
    },
    getDomData(selector) {
      // 得到元素的宽高
      return new Promise((res) => {
        const query = uni.createSelectorQuery().in(this);
        const dom = query.select(selector);
        console.log(dom)
        dom.fields({
          rect: true, // 是否返回节点布局位置信息{left,top,right,bottom}
          size: true, // 是否返回节点尺寸信息{width，height}
          scrollOffset: true, // 是否返回节点滚动信息{scrollLeft,scrollTop}
        }, (data) => {
          // data 可以返回第一个参数对象中指定为true的相关信息
          res(data)
        }).exec(() => {
        // 上述节点信息获取成功后执行的回调函数
        })
      })
    },
  },
};
</script>

<style lang="scss" scoped>
$mainColor: #e3f0ea;
.scroll-bar-box{
  border: 1px solid #fff;
  .bar-list-view {
    display: flex;
    white-space: nowrap;
    width: 100%;
    background-color: #ffffff;
    height: 60rpx;
    margin-bottom: 40rpx;
    margin-top: 40rpx;
    .bar-item {
      display: inline-block;
      white-space: nowrap;
      height: 60rpx;
      position: relative;
      &:first-child .bar-item-act {
        margin-left: 36rpx;
      }
      &:last-child .bar-item-act {
        margin-right: 36rpx;
      }

      .bar-item-act {
        margin-left: 30rpx;
        margin-right: 30rpx;
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .bar-item-txt {
          font-size: 28rpx;
          color: #bbbbbb;
        }
        .bar-item-bottom {
          position: absolute;
          bottom: 0;
          width: 100%;
          .bar-item-bottom-color {
            width: 100%;
            height: 6rpx;
          }
        }
      }
      .bar-item-acted {
        .bar-item-txt {
          color: #1d1d1d;
        }
        .bar-item-bottom {
          .bar-item-bottom-color {
            background: #e3f0ea;
          }
        }
      }
    }
  }
}

</style>
