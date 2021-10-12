<template>
  <picker
    :range="range"
    :range-key="rangeKey"
    :data-type="dataType"
    :value="rangeIndex"
    @change="handleChange"
  >
    <view class="picker-content">
      <input
        class="picker-text"
        :value="textValue"
        :placeholder="placeholder"
        disabled="disabled"
      />
      <view class="icon-font icon-icon-youjiantou"></view>
    </view>
  </picker>
</template>

<script>
import { get } from '@/utils/utilityOperationHelper';

export default {
  name: 'picker',
  props: {
    placeholder: {
      type: String,
    },
    range: {
      type: Array,
    },
    rangeKey: {
      type: String,
      default() {
        return 'name';
      },
    },
    valueKey: {
      type: String,
      default() {
        return 'code';
      },
    },
    dataType: {
      type: String,
      default() {
        return 'area';
      },
    },
    value: {
      type: Object,
      default() {
        return {
          name: '',
          code: '',
        };
      },
    },
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  data() {
    return {
      textValue: '',
      rangeIndex: 0,
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val && this.range) {
          const selectedItem = this.range.find(
            (item) => item[this.valueKey] === val.code,
          );
          if (selectedItem) {
            this.textValue = selectedItem[this.rangeKey];
          } else {
            this.textValue = val.name;
          }

          // 获取下标
          const index = this.range.findIndex(
            (item) => item[this.valueKey] === val.code,
          );
          this.rangeIndex = index >= 0 ? index : 0;
        } else {
          this.textValue = val.name;
          this.rangeIndex = 0;
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleChange(e) {
      const item = this.range[parseInt(e.detail.value)];
      this.textValue = item[this.rangeKey];
      this.$emit('input', {
        name: get(item, 'name'),
        code: get(item, 'code'),
      });
      this.$emit('change', e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/utilities.scss";
.picker-content {
  position: relative;
  width: 100%;
  height: rpx(40);
  color: #1d1d1d;
  font-size: rpx(14);

  .picker-text {
    width: 100%;
    height: 100%;
    border: rpx(1) solid #1d1d1d;
    border-radius: 0;
    padding: 0 rpx(30) 0 rpx(13);
  }
}

.icon-font {
  position: absolute;
  right: rpx(13);
  top: 50%;
  transform: translateY(-50%) rotate(90deg);
  font-size: rpx(12);
  color: #1d1d1d;
}
</style>
