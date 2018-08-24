import * as clusters from '@/lib/clusters'
import {CLUSTER_REST_PROXY, CONTENT_JSON_KAFKA_JSON} from '@/lib/constants'

const state = {
  produced: []
}

const getters = {
}

const actions = {
  async message ({commit}, {topic, records}) {
    await clusters.request(CLUSTER_REST_PROXY).post(`/topics/${topic}`, {records}, {
      headers: {
        'Content-Type': CONTENT_JSON_KAFKA_JSON
      }
    })
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
