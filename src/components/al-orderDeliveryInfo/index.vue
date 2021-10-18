<template>
  <view>
     <!-- 配送信息 -->
      <view class="distribution-info">
        <view class="title">配送信息 </view>
        <view class="distribution-detail">
          <view class="d-item">
            <text class="name">{{get(orderInfo, 'receiptInfo.name')}}</text>
            <text>{{get(orderInfo, 'receiptInfo.mobile')}}</text>
          </view>
          <view class="d-item detail">
            {{ addressDetail }}
          </view>
        </view>
      </view>
      <!-- 物流信息 -->
      <view class="logistics-info" v-if="orderInfo.logistics">
        <view class="sub-title">物流信息</view>
        <view class="tracking-num" v-if="orderInfo.logistics"
          >物流单号：{{
            orderInfo.logistics[0].trackingNo
              ? orderInfo.logistics[0].trackingNo
              : ""
          }}
          {{
            orderInfo.logistics[0].logisticsProviderName
              ? orderInfo.logistics[0].logisticsProviderName
              : ""
          }}
        </view>
        <view class="logistics-info-list">
          <block v-if="viewMore">
            <view
              class="logistics-info-item"
              v-for="(wlItem, index) in orderInfo.logisticsRoutes"
              :key="index"
            >
              <view>快递已到达{{ orderInfo.description }}</view>
              <view class="logistics-info-time">{{
                wlItem.modifyTime ? wlItem.modifyTime.substring(0, 19) : ""
              }}</view>
            </view>
          </block>
        </view>
        <view
          class="logistics-view-more"
          v-if="orderInfo.logistics.length > 1"
          @click="logViewMore"
        >
          <view v-if="viewMore"
            >收起<text class="icon-font icon-icon-shang"></text
          ></view>
          <view v-if="!viewMore"
            >展开<text class="icon-font icon-icon-xia"></text
          ></view>
        </view>
      </view>
  </view>
</template>

<script>
import { get } from '@/utils/utilityOperationHelper'

export default {
  name: 'OrderDeliveryInfo',
  props: {
    orderInfo: {
      type: Object,
      default: () => null,
    } 
  },
  data() {
    return {
      viewMore: false
    }
  },
  computed: {
    addressDetail() {
      const {
        province,
        city,
        district,
        address,
      } = get(
        this.orderInfo,
        'receiptInfo',
        {},
      );
      return `${province || ''} ${city || ''} ${district || ''} ${address || ''}`;
    }
  },
  methods: {
    get,
     logViewMore() {
      this.viewMore = !this.viewMore;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './index';
</style>
