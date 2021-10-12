<template>
  <view class="color-section">
    <rich-text class="question-title" :nodes="(content.question || '').replace(/\n/g, '<br/>')"></rich-text>
    <view class="movable" v-if="content.type === 'lineation'" @touchmove="handleTouchMove" @touchstart="handleTouchStart">
      <view class="line">
        <image class="icon line-icon" :style="[lineIconStyle]" :src="answerIcon"/>
      </view>
      <view class="anser-box">
        <view class="anser" v-for="(anser, index) in content.anser" :key="anser.returnValue" @click="handleClickAnser(index)">
          {{ anser.text }}
        </view>
      </view>
    </view>
    <!-- 选择的形式 -->
    <view class="select" v-if="content.type === 'select'">
      <view class="anser-box">
        <view class="anser" v-for="(anser, index) in content.anser" :key="anser.returnValue" @click="handleClickAnser(index)">
          <view class="checked">
            <image v-if="anserIndex === index" class="icon line-icon" :src="answerIcon"/>
          </view>
          {{ anser.text }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import answerIcon from '../../assets/images/tasaki.png'
import { get } from '../../utils/utilityOperationHelper'

export default {
  name: 'ColorSection',
  props: {
    content: {
      type: Object,
      default: () => {},
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    anserLength() {
      return (get(this.content, 'anser') || []).length
    },
    space() {
      if (this.anserLength > 1) {
        return Math.floor(100 / (this.anserLength - 1))
      }
      return 100
    },
    lineIconStyle() {
      if (this.anserIndex === 0) {
        return { left: '3%' };
      } if (this.anserIndex === this.anserLength - 1) {
        return { left: '97%' }
      }
      return { left: `${this.anserIndex * this.space}%` }
    },
  },
  data() {
    return {
      answerIcon,
      anserIndex: -1,
    }
  },
  watch: {
    content: {
      handler() {
        this.initAnserIndex()
      },
      immediate: true,
    },
  },
  methods: {
    handleTouchStart() {},
    handleTouchMove() {},
    handleClickAnser(index) {
      this.anserIndex = index
      const anserInfo = this.content.anser[index] || {}
      this.$emit('returnValue', {
        id: this.content.id,
        returnValue: anserInfo.returnValue,
        nextId: anserInfo.nextId,
        anserIndex: index,
      })
    },
    initAnserIndex() {
      this.anserIndex = get(this.content, 'type') === 'lineation' ? 1 : -1
    },
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
