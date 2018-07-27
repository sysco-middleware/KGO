import * as config from '@/lib/config'

const state = {}

const getters = {
  active () {
    return config.active()
  },
  get (state) {
    return (key) => {
      return config.get(key)
    }
  }
}

const actions = {
}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
