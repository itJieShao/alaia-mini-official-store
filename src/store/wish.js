import {
  createFavoriteApi,
  delFavoriteApi,
  fetchFavoritesDetailApi
} from '../service/apis/user';
import {
  get
} from '../utils/utilityOperationHelper'

const state = {

};
const getters = {

}
const actions = {
  createFavorite(_, params) {
    return createFavoriteApi(params).then((res) => res)
  },
  delFavorite(_, params) {
    return delFavoriteApi(params).then((res) => res)
  },
  fetchFavoritesList(_, params) {
    return fetchFavoritesDetailApi(params).then((res) => res)
  },
}
const mutations = {
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
