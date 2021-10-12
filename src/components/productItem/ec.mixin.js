import dayjs from 'dayjs'
import { SCREEN_NAME } from '../../utils/ga'

const CODE = 'SPU54'
const ENTRYS = [SCREEN_NAME.PLP, SCREEN_NAME.INDEX, SCREEN_NAME.ACTIVITY_PLP]

function dateIsBetween(after, before) {
  return this.isAfter(after) && this.isBefore(before)
}

export default {
  methods: {
    /**
     * 鱼子精华跳转ec
     * @returns boolean 是否跳转到ec
     */
    navigatorToEc() {
      const { code } = this.product || {}
      if (code === CODE && ENTRYS.includes(this.screenName)) {
        // 5.6 到 5.12, 5.21 到 7.31 跳常规 todo
        if (dateIsBetween.call(dayjs(), '2021-05-06 00:00:00', '2021-05-12 23:59:59')
        || dateIsBetween.call(dayjs(), '2021-05-21 00:00:00', '2021-07-31 23:59:59')) {
          return true
        }

        // 5.13 到 5.20 跳520
        if (dateIsBetween.call(dayjs(), '2021-05-13 00:00:00', '2021-05-20 23:59:59')) {
          return true
        }
      }

      return false
    },
  },
}
