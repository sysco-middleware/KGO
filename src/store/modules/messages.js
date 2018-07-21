import Vue from 'vue'
import axios from 'axios'
import * as utils from '@/lib/utils'

// FIXME: use set config values
const request = axios.create({
  baseURL: 'http://localhost:8082'
})

const CONSUMER_FORMAT_ERROR = 40601
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
   * @param  {Object}  [config={}]       The config given to the consumer
   * @return {Promise}                   The promise gets resolved if the given consumer is found or created
   */
  async consumer ({commit, state, dispatch}, {name, topic, format = 'binary', config = {}, resurrecting = false}) {
    // Check if the consumer already exists
    if (state.consumers[topic] && !(state.consumers[topic].died && resurrecting)) {
      const consumer = state.consumers[topic]

      if (consumer.format === format) {
        return
      }

      await dispatch('revokeConsumer', topic)
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
      format,
      config
    })
  },
  /**
   * Revoke the given consumer by sending a DELETE request to
   * the Kafka REST Proxy.
   * @param  {String}  topic  Name of the topic
   * @return {Promise}        This promise gets resolved once the consumer is deleted
   */
  async revokeConsumer ({commit, state}, topic) {
    try {
      const consumer = state.consumers[topic]
      await request.delete(consumer.url)
    } finally {
      commit('revokeConsumer', topic)
    }
  },
  /**
   * Resurrect the consumer for the given topic. A consumer needs to be resurrect/created again
   * if it has been inactive for more then 5 min.
   * @param  {String}  topic Name of the topic
   * @return {Promise}       This promise gets resolved once the consumer is resurrected
   */
  async resurrectConsumer ({dispatch, state}, {topic}) {
    const consumer = state.consumers[topic]

    if (!consumer) {
      throw new Error('there was no consumer found for the given topic')
    }

    await dispatch('consumer', {
      topic,
      name: consumer.name,
      format: consumer.format,
      config: consumer.config,
      resurrecting: true
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

    commit('checkActivityConsumer', topic)

    if (consumer.died) {
      await dispatch('resurrectConsumer', {topic})
    }

    try {
      let {data: messages} = await request.get(`${consumer.url}/topics/${topic}`, {
        headers: {
          'Accept': `application/vnd.kafka.v1+json`
        }
      })

      commit('updateConsumerActivity', topic)

      // Parse the kafka messages
      messages = messages.map((message) => {
        if (message.value) {
          switch (consumer.format) {
            case 'binary':
              message.value = atob(message.value)
              break
          }
        }

        return message
      })

      // Make array ascending
      messages = messages.reverse()

      commit('append', {
        topic,
        messages
      })
    } catch (error) {
      const {data} = error.response || {}
      const {error_code: errorCode} = data || {}

      if (errorCode === CONSUMER_FORMAT_ERROR) {
        await dispatch('revokeConsumer', topic)
        await commit('topics/revokeFormat', topic, {root: true})
      }
    }
  }
}

const mutations = {
  /**
   * Set a consumer for the given topic.
   * If there is already a consumer available for the given topic
   * is it overridden.
   * @param  {String} group  Name of the consumer group
   * @param  {String} name   Name of the consumer
   * @param  {String} format Format of the consumer
   * @param  {String} topic  Name of the topic
   * @param  {Object} config Consumer configurations
   */
  consumer (state, {group, name, format, topic, config}) {
    const {baseURL} = request.defaults
    const lastActive = new Date()

    Vue.set(state.consumers, topic, {
      url: `${baseURL}/consumers/${group}/instances/${name}`,
      name,
      group,
      format,
      config,
      lastActive,
      died: false
    })
  },
  /**
   * Check if a consumer has had any activity in the last 5 min.
   * If a consumer has been inactive for longer then 5 min did it died.
   * @param  {String} topic Name of the topic
   */
  checkActivityConsumer (state, topic) {
    if (!state.consumers[topic]) {
      return
    }

    const consumer = state.consumers[topic]
    const now = new Date()

    const diffMs = (now - consumer.lastActive)
    const diff = Math.round(((diffMs % 86400000) % 3600000) / 60000) // difference in minutes

    if (diff >= 5) {
      Vue.set(state.consumers[topic], 'died', true)
    }
  },
  /**
   * Update the last active date of the consumer to "now"
   * @param  {String} topic Name of topic
   */
  updateConsumerActivity (state, topic) {
    if (!state.consumers[topic]) {
      return
    }

    const currentDate = new Date()
    Vue.set(state.consumers[topic], 'lastActive', currentDate)
  },
  /**
   * Append the given messages to the message collection of the given topic.
   * @param  {String}     topic    Name of topic
   * @param  {Array<any>} messages Messages to be appended
   */
  append (state, {topic, messages}) {
    if (!state.messages[topic]) {
      Vue.set(state.messages, topic, [])
    }

    state.messages[topic].push(...messages)
  },
  /**
   * Delete the given topic consumer of consumers object.
   * @param  {String} topic Name of the topic
   */
  revokeConsumer (state, topic) {
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
