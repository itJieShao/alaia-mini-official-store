<template>
  <view class="tab-bar-container" v-if="!tabBarHide">
    <view class="tab-bar">
      <view class="tab-bar-wrap">
        <view
          v-for="(nav, index) in menuList"
          :key="index"
          :class="['tab-item', tabSelected == index ? 'tab-item-selected' : '']"
          @tap="handleTap(nav, index)"
        >
          <button
            class="item-con"
            open-type="contact"
            @contact="bindContact"
            v-if="nav.icon == 'icon-service'"
          >
            <view :class="['icon', nav.icon]">
              <image
                class="icon-img"
                mode="widthFix"
                :src="
                  tabSelected == index ? nav.selectedIconPath : nav.iconPath
                "
              ></image>
            </view>
            <view class="text">{{ nav.label }}</view>
          </button>
          <view class="item-con" v-else>
            <view :class="['icon', nav.icon]">
              <image
                class="icon-img"
                mode="widthFix"
                :src="
                  tabSelected == index ? nav.selectedIconPath : nav.iconPath
                "
              ></image>
              <!-- 购物车需要显示商品数量 -->
              <!-- <template v-if="nav.icon === 'icon-cart'">
                <view class="num-box" v-if="cartNumber > 0">
                  <text class="text num-text">{{cartNumber}}</text>
                </view>
              </template> -->
            </view>
            <view class="text">{{ nav.label }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 已不使用客服弹层 -->
    <!-- <service :visible="isShowService" @close="handleCloseService" /> -->
  </view>
</template>

<script>
import {
  mapState, mapMutations, mapActions, mapGetters,
} from 'vuex';
import service from '../components/service';
import { trackerClick, EVENT_TYPE } from '../utils/ga';

export default {
  components: {
    service,
  },
  data() {
    return {
      isShowService: false,
      defaultColor: '#BBBBBB',
      selectedColor: '#1D1D1D',
    };
  },
  computed: {
    ...mapState('globle', ['tabSelected', 'sessionFrom', 'tabBarHide']),
    ...mapGetters('shoppingCart', ['cartNumber']),
    menuList() {
      return [
        {
          url: '/pages/index/index',
          label: '首页',
          icon: 'icon-home',
          iconPath:
            'https://res-tasaki.baozun.com/static/images/icon-home.png',
          selectedIconPath:
            'https://res-tasaki.baozun.com/static/images/icon-home-active.png',
        },
        {
          url: '/pages/category/index',
          label: '分类',
          icon: 'icon-category',
          iconPath:
            'https://res-tasaki.baozun.com/static/images/icon-classify.png',
          selectedIconPath:
            'https://res-tasaki.baozun.com/static/images/icon-classify-active.png',
        },
        {
          url: '/pages/shoppingCar/index',
          label: '购物袋',
          icon: 'icon-cart',
          iconPath:
            'https://res-tasaki.baozun.com/static/images/icon-cart.png',
          selectedIconPath:
            'https://res-tasaki.baozun.com/static/images/icon-cart-active.png',
        },
        {
          url: '',
          label: '客服',
          icon: 'icon-service',
          iconPath:
            'https://res-tasaki.baozun.com/static/images/icon-service.png',
          selectedIconPath:
            'https://res-tasaki.baozun.com/static/images/icon-service-active.png',
        },
        {
          url: '/pages/account/index',
          label: '我的',
          icon: 'icon-user',
          iconPath:
            'https://res-tasaki.baozun.com/static/images/icon-my.png',
          selectedIconPath:
            'https://res-tasaki.baozun.com/static/images/icon-my-active.png',
        },
      ];
    },
  },
  methods: {
    ...mapMutations('globle', ['setTabSelected']),
    // ...mapActions('search', ['setMenuName']),
    handleTap(menu, index) {
      // 点击客服不跳转
      if (index !== 3) {
        this.setTabSelected(index);
        console.log('tabbarClick--->', menu, index);
        if (menu && menu.url) {
          this.isShowService = false;
          uni.switchTab({
            url: menu.url,
          });
        } else {
          this.isShowService = true;
          // this.setMenuName();
        }
      }
      // ga埋点
      // trackerClick({
      //   ...EVENT_TYPE.NAV_BAR,
      //   label: menu.label,
      //   screenName: 'tab-bar',
      // });
    },
    handleCloseMenu() {
      this.isShowService = false;
    },
    bindContact(e) {},
  },
};
</script>

<style lang="scss">
@import "@/styles/utilities.scss";

.tab-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: calc(112rpx + var(--safe-area-inset-bottom));
  z-index: 1000;
  font-size: rpx(0);
  background-color: #fff;
  border-top: 1rpx solid #fff;
  box-shadow: 0 rpx(2) rpx(4) 0 #dddddd;
  padding: 0 rpx(12);

  .tab-bar-wrap {
    width: 100%;
    height: rpx(56);
    font-size: rpx(12);
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    background-color: #fff;
  }

  .tab-item {
    position: relative;
    width: 25%;

    .item-con {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
      transform: translate(-50%, -50%);
      background: transparent;
    }

    .text {
      letter-spacing: rpx(1);
      line-height: rpx(14);
      color: #bbbbbb;
      width: 100%;
      text-align: center;
      font-size: rpx(12);
    }

    .icon {
      margin-bottom: rpx(3);
      position: relative;
      width: rpx(27);
      height: rpx(27);

      .icon-img {
        width: rpx(27);
      }
    }

    .num-box {
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      background-color: #2e3235;
      border: 1rpx solid #fff;
      color: #fff;
      position: absolute;
      top: -4rpx;
      right: -14rpx;
      box-sizing: border-box;
      font-size: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.tab-item-selected {
      .text {
        color: #1d1d1d;
      }
    }
  }
}
</style>
