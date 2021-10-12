import { shopApi } from '../service/apis/shop'

const state = {

}
const actions = {
    shopApi(_, params) {
        return shopApi(params).then((res) => {
          return res
        })
        
    },
}

const mutations = {

}

export default {
    state,
    actions,
    mutations
}