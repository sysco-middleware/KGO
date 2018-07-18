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
    commit('setTopics', topics)
  },
  async fetch ({commit}, name) {
    const {data: topic} = await request.get(`/topics/${name}`)

    commit('setTopic', {
      name,
      value: topic
    })
  }
}

const mutations = {
  setTopics (state, topics) {
    for (let topic of topics) {
      if (state.topics[topic]) {
        continue
      }

      Vue.set(state.topics, topic, {})
    }
  },
  setTopic (state, {name, value}) {
    Vue.set(state.topics, name, value)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
