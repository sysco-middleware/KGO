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
  /**
   * Create a new consumer if it does not exists.
   * The consumer will use the session Kafka group.
   * @param  {String}  name              Name of consumer
   * @param  {String}  topic             Name of topic to be used on
   * @param  {String}  [format='binary'] Deserialization format of data from Kafka
   * @param  {Object}  [config={}}]      The config given to the consumer
   * @return {Promise}                   The promise gets resolved if the given consumer is found or created
   */
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
  /**
   * Fetch the latest messages from the topic consumer.
   * A Error is thrown if no consumer is found for the given topic.
   * @param  {String}  topic    Name of topic
   * @return {Promise}          This promise gets resolved once the latest messages are fetched
   */
  async fetch ({commit, dispatch, state}, {topic}) {
    const consumer = state.consumers[topic]

    if (!consumer) {
      throw new Error(`no consumer found for: ${topic}`)
    }

    let {data: messages} = await request.get(`${consumer.url}/topics/${topic}`, {
      headers: {
        'Accept': `application/vnd.kafka.v1+json`
      }
    })

    // Parse the kafka messages
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
