import * as config from '@/lib/config'
import {CONFIG_CLUSTER_KEY} from '@/lib/constants'

const state = {
  clusters: [],
  selected: null
}

const getters = {
  selected (state) {
    return state.selected
  }
}

const actions = {
  fetch ({commit}) {
    const clusters = config.get(CONFIG_CLUSTER_KEY)
    commit('set', clusters)
  }
}

const mutations = {
  set (state, clusters) {
    const [first] = clusters
    state.clusters = clusters
    state.selected = first
  },
  select (state, cluster) {
    state.selected = cluster
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
