<template>
  <div class="services">
    <div class="services-actions bg-white">
      <div class="action-item">
        <button open-type="contact" class="btn action-text" session-from="sobot">
          <i class="icon iconfont iconCHAT"></i>
          在线客服
        </button>
      </div>
      <div class="action-item" @click="handleMakePhoneCall">
        <i class="icon iconfont iconPHONE"></i>
        <span class="action-text">{{phone}}</span>
      </div>
      <div class="action-item" @click="linkToEmail">
        <i class="icon iconfont iconENVELOPPE"></i>
        <span class="action-text">邮箱</span>
      </div>
    </div>
    <div class="cancel-action bg-white" @click="closeModel">
      <div class="cancel-btn">取消</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'services',
  data() {
    return {
      phone: '400 616 1698',
    };
  },
  methods: {
    closeModel() {
      this.$emit('close');
    },
    handleMakePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.phone,
      });
    },
    linkToEmail() {
      this.router.navigateTo('/subpkgs/page/pages/index?scene=contactUs.html').then(() => {
        this.closeModel()
      })
    },
  },
};
</script>

<style scoped lang="scss">
  @import "./services.scss";
</style>
