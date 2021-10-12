const state = {
  searchPageType: 1, //为1显示默认搜索页，为2显示搜索成功页，为3显示搜索失败页
  keyword:"",
};
const getters = {

}
const actions = {

};
const mutations = {
  setSearchPageType(state,type){
    state.searchPageType = type;
  },
  setKeyword(state,keyword){
    state.keyword = keyword;
  },
}
export default {
  state,
  getters,
  actions,
  mutations,
}
