import * as clusters from '@/lib/clusters'
import {CLUSTER_REST_PROXY, PROXY_CONTENT_JSON_JSON} from '@/lib/constants'

const state = {
  produced: []
}

const getters = {
}

const actions = {
  async message ({commit}, {topic, records}) {
    await clusters.request(CLUSTER_REST_PROXY, {
      content: PROXY_CONTENT_JSON_JSON
    }).post(`/topics/${topic}`, {records})
  }
}

const mutations = {
  produced (state, {topic, records}) {
    state.produced.push({
      topic,
      records
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
