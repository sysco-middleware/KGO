import Vue from 'vue'
import * as clusters from '@/lib/clusters'
import {CLUSTER_REST_PROXY, PROXY_CONTENT_JSON_JSON} from '@/lib/constants'

const state = {
  produced: {}
}

const getters = {
}

const actions = {
  /**
   * Produce a the given records to the given topic.
   * A record contains all information for a given message.
   * @param  {String} options.topic           Name of the topic that you want to commit to
   * @param  {Array<Object>} options.records  Array containing all records that you want to commit
   */
  async message ({commit}, {topic, records}) {
    await clusters.request(CLUSTER_REST_PROXY, {
      content: PROXY_CONTENT_JSON_JSON
    }).post(`/topics/${topic}`, { records })

    for (let record of records) {
      commit('produced', { topic, record })
    }
  }
}

const mutations = {
  /**
   * Push a produced message to the state
   * @param  {String} options.topic   Name of the topic where the record was produced towards
   * @param  {Object} options.record  The record produced into kafka
   */
  produced (state, {topic, record}) {
    if (!state.produced[topic]) {
      Vue.set(state.produced, topic, [])
    }

    state.produced[topic].push(record)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
