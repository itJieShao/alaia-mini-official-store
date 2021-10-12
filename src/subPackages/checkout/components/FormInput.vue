<template>
  <input class="form-input" :value="value" :style="width?`width:${width}rpx`:'width:690rpx'" @input="handleInput" @blur="handleBlur"/>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    width: {
      type: Number,
    },
    value: {
      type: String,
    },
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.detail.value);
    },
    handleBlur(e) {
      this.$emit('blur', e.detail.value)
    },
  },
};
</script>

<style lang="scss" scoped>
.form-input {
  height: 65rpx;
  border-bottom: 1rpx solid #4e5153;
}
</style>
