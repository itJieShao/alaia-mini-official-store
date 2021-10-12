import { USER_ACTION_SET_ID } from '@/constants/userAction'
import { createUserActionApi } from '../service/apis'

const state = {}
const getters = {}
const actions = {
  createUserAction(_, params) {
    return createUserActionApi({
      userActions: [
        {
          ...params,
          url: 'http://www.qq.com',
          userActionSetId: USER_ACTION_SET_ID,
          actionTime: Math.round(Date.now() / 1000),
        },
      ],
    })
  },
}
const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
