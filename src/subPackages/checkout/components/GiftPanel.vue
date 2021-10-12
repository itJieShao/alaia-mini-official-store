<template>
  <panel>
    <panel-title title="礼物寄语" @panelTitleTap="handleTitleTap"></panel-title>
    <panel-content :show="showContent">
      <form-item>
        <form-content>
          <view>
            <form-textarea :height="130" placeholder="输入可选的礼品信息，仅限255个字符" v-model="message" @input="handleInput"></form-textarea>
            <form-error v-show="isError">*您的祝福语输入有误</form-error>
          </view>
        </form-content>
      </form-item>
    </panel-content>
  </panel>
</template>

<script>
import Panel from '../../../components/panel';
import PanelTitle from '../../../components/panelTitle';
import PanelContent from '../../../components/panelContent';
import FormItem from './FormItem';
import FormTitle from './FormTitle';
import FormContent from './FormContent';
import FormTextarea from './FormTextarea';
import utils from '../../../utils/utils'
import FormError from './FormError'

export default {
  name: 'GiftPanel',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  components: {
    Panel,
    PanelTitle,
    PanelContent,
    FormItem,
    FormTitle,
    FormContent,
    FormTextarea,
    FormError,
  },
  data() {
    return {
      showContent: false,
      message: '',
      isError: false,
    };
  },
  methods: {
    handleTitleTap() {
      this.showContent = !this.showContent;
    },
    handleInput() {
      this.isError = false
      this.$emit('input', this.message)
      // 不能有特殊字符和表情包
      if (this.message && (utils.checkEmoji(this.message) || utils.checkSpecialCharacter(this.message))) {
        this.isError = true
      }
    },
  },
};
</script>
