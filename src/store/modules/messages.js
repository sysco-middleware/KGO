import Vue from 'vue'
import axios from 'axios'

// FIXME: use set config values
const request = axios.create({
  baseURL: 'http://localhost:8082'
})

const state = {
  consumers: {},
  messages: {}
}

const getters = {
}

const actions = {
  async consumer ({commit}, {topic, name, config = {}}) {
    try {
      const {data: consumer} = await request.post(`/consumers/${topic}`, {
        ...config,
        name
      })
    } catch (error) {
      const {error_code: errorCode} = error.response.data

      if (errorCode !== 40902) {
        throw error
      }
    } finally {

    }
  },
  async fetch ({commit, dispatch, state}, {topic, name}) {
    if (!state.consumers[topic] || !state.consumers[topic][name]) {
      throw new Error('the given group or consumer is not found in memory')
    }

    const consumer = state.consumers[topic][name]
    const messages = await request.get(consumer.base_uri)

    console.log(messages)
  }
}

const mutations = {
  consumer (state, {name, topic, consumer}) {
    console.log(state, topic, consumer)
    if (!state.consumers[topic]) {
      Vue.set(state.consumers, topic, {})
    }

    Vue.set(state.consumers[topic], name, consumer)
  },
  append (state, {topic, messages}) {
    if (!state.messages[topic]) {
      Vue.set(state.messages, topic, [])
    }

    state.messages[topic].append(...messages)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
