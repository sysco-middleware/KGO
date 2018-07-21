import Vue from 'vue'
import axios from 'axios'

// FIXME: use set config values
const request = axios.create({
  baseURL: 'http://localhost:8082'
})

const state = {
  topics: {}
}

const getters = {
}

const actions = {
  async fetchAll ({commit}) {
    const {data: topics} = await request.get('/topics')
    commit('set', topics)
  },
  async fetch ({commit, state}, topic) {
    const {data: info} = await request.get(`/topics/${topic}`)

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

    Vue.set(state.topics[topic], 'format', format)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
