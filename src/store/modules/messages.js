import Vue from 'vue'
import axios from 'axios'
import * as utils from '@/lib/utils'

// FIXME: use set config values
const request = axios.create({
  baseURL: 'http://localhost:8082'
})

const KAFKA_GROUP_PREFIX = 'kafka-ui'

const state = {
  consumers: {},
  messages: {},
  session: utils.GUID()
}

const getters = {
}

const actions = {
  async consumer ({commit, state}, {name, topic, format = 'binary', config = {}}) {
    // Check if the consumer already exists
    if (state.consumers[topic]) {
      const consumer = state.consumers[topic]

      if (consumer.format === format) {
        return
      }

      commit('revoke', {topic})
    }

    const group = `${KAFKA_GROUP_PREFIX}-${state.session}`
    await request.post(`/consumers/${group}`, {
      ...config,
      format,
      name
    })

    commit('consumer', {
      name,
      topic,
      group,
      format
    })
  },
  async fetch ({commit, dispatch, state}, {topic}) {
    const consumer = state.consumers[topic]

    if (!consumer) {
      return
    }

    let {data: messages} = await request.get(`${consumer.url}/topics/${topic}`, {
      headers: {
        'Accept': `application/vnd.kafka.v1+json`
      }
    })

    messages = messages.map((message) => {
      switch (consumer.format) {
        case 'binary':
          message.value = atob(message.value)
          break
      }

      return message
    })

    commit('append', {
      topic,
      messages
    })
  }
}

const mutations = {
  consumer (state, {group, name, format, topic}) {
    const {baseURL} = request.defaults

    Vue.set(state.consumers, topic, {
      url: `${baseURL}/consumers/${group}/instances/${name}`,
      group,
      format
    })
  },
  append (state, {topic, messages}) {
    if (!state.messages[topic]) {
      Vue.set(state.messages, topic, [])
    }

    state.messages[topic].push(...messages)
  },
  revoke (state, topic) {
    Vue.delete(state.consumers, topic)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
