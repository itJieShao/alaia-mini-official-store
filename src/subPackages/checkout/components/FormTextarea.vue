<template>
  <view class="textarea" @click="handleClick">
    <textarea
      v-if="value || visibleInput"
      @blur="handleBlur"
      :focus="visibleInput"
      class="form-textarea"
      maxlength="255"
      @input="handleInput"
      :value="value"
      :style="textAreaStyle"></textarea>
    <view v-else class="default-text-area">
      <view class="default-text-area-placeholder">{{ placeholder }}</view>
    </view>
  </view>

</template>

<script>
export default {
  name: 'FormTextarea',
  props: {
    value: {
      type: String,
    },
    placeholder: {
      type: String,
      default() {
        return '';
      },
    },
    height: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  data() {
    return {
      visibleInput: false,
    }
  },
  computed: {
    textAreaStyle() {
      if (this.height > 0) {
        return { height: `${this.height}rpx` }
      }
      return {}
    },
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.detail.value);
    },
    handleClick() {
      this.visibleInput = true
    },
    handleBlur() {
      if (!this.value) {
        this.visibleInput = false
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.textarea {
  margin-top: 30rpx;
  padding: 15rpx 2%;
  width: 690rpx;
  border: 1rpx solid #4e5153;
  .form-textarea {
    width: 100%;
    word-wrap: break-word;
    overflow: hidden;
    height: 100rpx;
  }
  .default-text-area {
    width: 100%;
    height: 100rpx;
    font-weight: 300;
    word-wrap: break-word;
    overflow: hidden;
    .default-text-area-placeholder {
      margin-left: 6rpx;
      margin-top: 13rpx;
      font-weight: 400;
      color: #4e5153;
    }
  }
}
</style>
