class Animation {
  constructor(options) {
    this.options = {
      duration: 400,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 50% 0',
      ...options,
    }
  }

  options = {}

  actions = []

  animates = []

  opacity(opacity) {
    this.animates.push({ type: 'style', args: ['opacity', opacity] })
    return this
  }

  translateX(translateX) {
    this.animates.push({ type: 'translateX', args: [translateX] })
    return this
  }

  translateY(translateY) {
    this.animates.push({ type: 'translateY', args: [translateY] })
    return this
  }

  translate(...translate) {
    this.animates.push({ type: 'translate', args: translate })
    return this
  }

  scale(scaleX, scaleY = scaleX) {
    this.animates.push({ type: 'scale', args: [scaleX, scaleY] })
    return this
  }

  step(option = {}) {
    const { transformOrigin, ...transition } = {
      ...this.options,
      ...option,
    }

    this.actions.push({
      animates: this.animates.splice(0),
      option: {
        transformOrigin,
        transition,
      },
    })
  }

  export() {
    return {
      actions: this.actions.splice(0),
    }
  }
}

/**
 * uni.createAnimation 返回的实例，并没有实现多段动画的场景，
 * 返回的animationData存在错位、时间节点错乱等bug
 * 本例createAnimation只实现部分api，如果需要用到可以参考opacity/translate等方法的实现
 *
 * 注意：即便重写这部分api，可能会出现部分元素无法保留最后一帧的动画参数，出现异样，可针对性的添加动画参数
 * animation.translateX(rpxToPx(117)).step()
 * animation.translateX(rpxToPx(117)).opacity(0).step({ delay: 2000 })
 */
export function createAnimation(options) {
  return new Animation(options)
}

export default {}
