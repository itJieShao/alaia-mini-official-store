import eventBus from '../eventBus'

export default {
  props: {
    openType: String,
  },
  methods: {
    bindGetUserInfo(event) {
      this.$emit('getuserinfo', event)
      // 这里emit是给dialog函数调用使用
      eventBus.$emit('getuserinfo', event)
    },

    bindContact(event) {
      this.$emit('contact', event)
      eventBus.$emit('contact', event)
    },

    bindGetPhoneNumber(event) {
      this.$emit('getphonenumber', event)
      eventBus.$emit('getphonenumber', event)
    },

    bindError(event) {
      this.$emit('error', event)
    },

    bindLaunchApp(event) {
      this.$emit('launchapp', event)
      eventBus.$emit('launchapp', event)
    },

    bindOpenSetting(event) {
      this.$emit('opensetting', event)
      eventBus.$emit('opensetting', event)
    },
  },
}
