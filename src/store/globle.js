export default {
  state: {
    tenantCode: '88000184', // 商户ID
    storeCode: '9999999999', // 店铺ID
    sessionFrom: '', // 传给客服相关信息
    tabSelected: 0, // tabBar选中
    tabUrl: '',
    sceneCode: '', // 入参解析
    tabBarHide: false,
    advertisingParam: null, // 广告参数
  },
  getters: {
    /*
    * @return
    * 传给客服相关信息
    * ...mapGetters('globle',["onlineService"]),
    * <button class="class" :session-from="onlineService" open-type="contact">在线客服</button>
    * */
    // onlineService: (state) => {
    //   const { userInfo } = wx.getStorageSync('infoRes');
    //   const params = ''; // 自定义参数
    //   console.log('userInfo:', userInfo)
    //   return state.sessionFrom = userInfo ? `sobot|${userInfo.nickName}|${userInfo.avatarUrl}|${params}` : ''
    // },
  },
  mutations: {
    setTabSelected(state, data) {
      state.tabSelected = data;
    },
    setSceneCode(state, data) {
      state.sceneCode = data
    },
    setTabBarHide(state, data) {
      state.tabBarHide = data;
    },
    setAdvertisingParam(state, data) {
      state.advertisingParam = data
    },
  },
  actions: {
    // async xxx({
    //   dispatch, commit, state, rootState, rootGetters,
    // }, data) {
    //   commit('xxx', data || false)
    //   return data
    // },
  },
  namespaced: true,
}
