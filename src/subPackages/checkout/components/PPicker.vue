<template>
  <picker class="picker" :range="range" :range-key="rangeKey" :data-type="dataType" :value="rangeIndex" @change="handleChange">
    <view class="picker-content">
      <input class="picker-text" :value="textValue" :placeholder="placeholder" disabled="disabled" />
      <view class="icon-down-mini"></view>
    </view>
  </picker>
</template>

<script>
import { get } from '../../../utils/utilityOperationHelper'

export default {
  name: 'PPicker',
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
        }
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
            this.textValue = val.name
          }

          // 获取下标
          const index = this.range.findIndex((item) => item[this.valueKey] === val.code)
          this.rangeIndex = index >= 0 ? index : 0
        } else {
          this.textValue = val.name;
          this.rangeIndex = 0
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
.picker {
  .picker-content {
    position: relative;
    width: 200rpx;

    .picker-text {
      border-bottom: 1rpx solid #4e5153;
    }

    .icon-down-mini::after {
      right: 2rpx;
      margin-top: -10rpx;
    }
  }
}
</style>
