<template>
   <panel :isShowBottomLine="false">
    <panel-title title="商品详情" :show-icon="false" @panelTitleTap="handleTitleTap"></panel-title>
    <panel-content :show="showContent">
      <view v-for="(product, index) in productList" :key="product.code">
        <OrderProductItem :product="{...product, gaIndex: index + 1}"/>
      </view>
    </panel-content>
  </panel>
</template>

<script>
import Panel from '../../../components/panel';
import PanelTitle from '../../../components/panelTitle';
import PanelContent from '../../../components/panelContent';
import OrderProductItem from '../../../components/orderProductItem'

export default {
  name: 'ProductListPanel',
  components: {
    Panel,
    PanelTitle,
    PanelContent,
    OrderProductItem,
  },
  props: {
    productList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showContent: true,
    };
  },
  methods: {
    handleTitleTap() {
      this.showContent = !this.showContent;
    },
  },
}
</script>
