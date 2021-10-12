export default {
  data() {
    return {
      computedHeight: 64,
      computedHeights: 64,
    }
  },
  mounted() {
    // nav bar高度
    const narBarHeight = 44;
    // 获取设备电源高度
    const mainPadding = uni.getSystemInfoSync().statusBarHeight + narBarHeight;
    this.computedHeight = `${mainPadding}px`;
    this.computedHeights = mainPadding;
  },
  methods: {},
}
