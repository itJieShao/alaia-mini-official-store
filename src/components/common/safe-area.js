let cache = null

function getSafeArea() {
  return new Promise((resolve, reject) => {
    if (cache != null) {
      resolve(cache)
    } else {
      uni.getSystemInfo({
        success: ({ model, screenHeight, statusBarHeight }) => {
          const iphoneX = /iphone x/i.test(model)
          const iphoneNew = /iPhone 11/i.test(model)

          cache = {
            isIPhoneX: iphoneX || iphoneNew,
            statusBarHeight,
          }

          resolve(cache)
        },
        fail: reject,
      })
    }
  })
}

const safeArea = ({
  safeAreaInsetBottom = true,
  safeAreaInsetTop = false,
} = {}) => ({
  props: {
    safeAreaInsetTop: {
      type: Boolean,
      default: safeAreaInsetTop,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: safeAreaInsetBottom,
    },
  },
  data: () => ({ isIPhoneX: false, statusBarHeight: 44 }),
  created() {
    getSafeArea().then(({ isIPhoneX, statusBarHeight }) => {
      // @ts-ignore
      this.isIPhoneX = isIPhoneX
      // @ts-ignore
      this.statusBarHeight = statusBarHeight
    })
  },
})

export default safeArea
