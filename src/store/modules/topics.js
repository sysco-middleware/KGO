import Vue from 'vue'
import * as clusters from '@/lib/clusters'
import {LOCAL_STORAGE_PREFIX, CLUSTER_REST_PROXY, PROXY_CONTENT_JSON} from '@/lib/constants'

const state = {
  topics: {}
}

const getters = {
}

const actions = {
  /**
   * Fetch all available topics and commit fetch all available
   * formats stored in local storage.
   */
  async fetchAll ({commit, state}) {
    const {data: topics} = await clusters.request(CLUSTER_REST_PROXY, {
      accept: PROXY_CONTENT_JSON
    }).get('/topics')

    commit('set', topics)

    for (let topic of topics) {
      const format = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}-${topic}`)

      if (!format) {
        continue
      }

      commit('format', {
        topic,
        format
      })
    }
  },
  /**
   * Fetch detailed information about the given topic.
   * @param {String} topic Name of the topic
   */
  async fetch ({commit, state, rootGetters: getters}, topic) {
    const {data: info} = await clusters.request(CLUSTER_REST_PROXY, {
      accept: PROXY_CONTENT_JSON
    }).get(`/topics/${topic}`)

    commit('append', {
      topic,
      info: info
    })
  }
}

const mutations = {
  set (state, topics) {
    for (let topic of topics) {
      if (state.topics[topic]) {
        continue
      }

      Vue.set(state.topics, topic, {})
    }
  },
  append (state, {topic, info}) {
    if (!state.topics[topic]) {
      Vue.set(state.topics, topic, {})
    }

    // Let's loop over the given info to not override
    // info set by the store (ex. format)
    for (let item in info) {
      Vue.set(state.topics[topic], item, info[item])
    }
  },
  format (state, {topic, format}) {
    if (!state.topics[topic]) {
      Vue.set(state.topics, topic, {})
    }

    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}-${topic}`, format)
    Vue.set(state.topics[topic], 'format', format)
  },
  revokeFormat (state, topic) {
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}-${topic}`)
    Vue.delete(state.topics[topic], 'format')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
