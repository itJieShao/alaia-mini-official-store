import {
  CRM_APP_ID, getCRMURI,
} from '../constants/crm'

export const toThirdMiniProgram = (unionId, activityId) => new Promise((resolve) => {
  uni.navigateToMiniProgram({
    appId: CRM_APP_ID,
    path: getCRMURI(unionId, activityId),
    success() {
      resolve()
    },
    fail(error) {
      resolve(error)
    },
  })
})
