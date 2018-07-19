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
  async fetch ({commit}, name) {
    const {data: topic} = await request.get(`/topics/${name}`)

    commit('append', {
      name,
      value: topic
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
  append (state, {name, value}) {
    Vue.set(state.topics, name, value)
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
