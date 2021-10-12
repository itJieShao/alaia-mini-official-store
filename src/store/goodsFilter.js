import {
  filterData
} from '../service/apis/goodsFilter';
import {
  get
} from '../utils/utilityOperationHelper'

const state = {
  fromTypeData1: {
    category: {},
    collection1: {},
    metallicProperty: {},
    rangeValues: [],
    goodsList: [],
    pageInfo: {},
    plp_params: {},
  },
  fromTypeData2: {
    category: {},
    collection1: {},
    metallicProperty: {},
    rangeValues: [],
    goodsList: [],
    pageInfo: {},
    plp_params: {},
  },
};
const getters = {
  fromTypeData1: (state) => state.fromTypeData1,
  fromTypeData2: (state) => state.fromTypeData2,
}
const actions = {
  getFilterData({}, params) {
    return filterData(params).then((res) => {
      const data = get(res, 'data.shop.filterCondition')
      return data;
    }).catch((error) => {
      console.log(error)
    })
  },
}
const mutations = {
  setFilterData(state, {type,data}) {
    type == 1 ? state.fromTypeData1 = data : state.fromTypeData2 = data;
  },
  clearFilterData(state, type) {
    type == 1 ? state.fromTypeData1 = {} : state.fromTypeData2 = {};
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
