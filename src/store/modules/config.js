import axios from 'axios'

const state = {
  active: null
}

const getters = {
  hasActive (state) {
    return Boolean(state.active)
  }
}

const actions = {
  async fetch ({commit}) {
    const {data: config} = await axios.get('/config.json')
    commit('setConfig', config)
  }
}

const mutations = {
  setConfig (state, config) {
    state.active = config
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
