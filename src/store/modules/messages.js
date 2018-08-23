import Vue from 'vue'
import axios from 'axios'
import * as utils from '@/lib/utils'
import * as config from '@/lib/config'
import {CONSUMER_FORMAT_ERROR, KAFKA_GROUP_PREFIX, CONTENT_JSON_KAFKA} from '@/lib/constants'

const request = axios.create({
  baseURL: config.get('kafka.rest.proxy.api'),
  headers: {
    'Content-Type': CONTENT_JSON_KAFKA
  }
})

const state = {
  consumers: {},
  messages: {},
  session: utils.GUID(),
  request: null
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

    // A format could also have a 'local' decoder (ex. json)
    // Local formats are given after a + (ex. 'binary+json')
    const [apiFormat] = format.split('+')

    const group = `${KAFKA_GROUP_PREFIX}-${state.session}`
    await request.post(`/consumers/${group}`, {
      ...config,
      format: apiFormat,
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
      await consumer.request({
        method: 'DELETE',
        data: {}
      })
    } catch (error) {
      // TODO: maybe log that the consumer was not found?
    } finally {
      commit('revokeConsumer', topic)
      commit('flushConsumed', topic)
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
      throw new Error('no consumer found for the given topic')
    }

    await dispatch('consumer', {
      topic,
      name: consumer.name,
      format: consumer.format,
      config: consumer.config,
      resurrecting: true
    })
  },
  async setOffsetBeginning ({state, rootState}, topic) {
    const consumer = state.consumers[topic]
    const {partitions} = rootState['topics'].topics[topic] || {}

    if (!consumer) {
      throw new Error('no consumer found for the given topic')
    }

    if (!partitions) {
      throw new Error('no paritions found for the given topic')
    }

    const payload = {
      partitions: [
        ...partitions.map((partition) => {
          return {
            topic,
            partition: partition.partition
          }
        })
      ]
    }

    await consumer.request.post('/positions/beginning', payload)
  },
  async setOffsetEnd ({state, rootState}, topic) {
    const consumer = state.consumers[topic]
    const {partitions} = rootState['topics'].topics[topic] || {}

    if (!consumer) {
      throw new Error('no consumer found for the given topic')
    }

    if (!partitions) {
      throw new Error('no paritions found for the given topic')
    }

    const payload = {
      partitions: [
        ...partitions.map((partition) => {
          return {
            topic,
            partition: partition.partition
          }
        })
      ]
    }

    await consumer.request.post('/positions/end', payload)
  },
  async seekToOffset ({state, rootState}, {topic, offset}) {
    const consumer = state.consumers[topic]
    const {partitions} = rootState['topics'].topics[topic] || {}

    if (!consumer) {
      throw new Error('no consumer found for the given topic')
    }

    if (!partitions) {
      throw new Error('no paritions found for the given topic')
    }

    const payload = {
      offsets: [
        ...partitions.map((partition) => {
          return {
            topic,
            offset,
            partition: partition.partition
          }
        })
      ]
    }

    await consumer.request.post('/positions', payload)
  },
  async assignToPartitions ({state, rootState}, topic) {
    const consumer = state.consumers[topic]
    const {partitions} = rootState['topics'].topics[topic] || {}

    if (!consumer) {
      throw new Error('no consumer found for the given topic')
    }

    if (!partitions) {
      throw new Error('no paritions found for the given topic')
    }

    const payload = {
      partitions: [
        ...partitions.map((partition) => {
          return {
            topic,
            partition: partition.partition
          }
        })
      ]
    }

    await consumer.request.post('/assignments', payload)
  },
  /**
   * Fetch the latest messages from the topic consumer.
   * A Error is thrown if no consumer is found for the given topic.
   * @param  {String}  topic    Name of topic
   * @return {Promise}          This promise gets resolved once the latest messages are fetched
   */
  async fetch ({commit, dispatch, state}, {topic, bytes = 50000, timeout = 5000}) {
    const consumer = state.consumers[topic]

    if (!consumer) {
      throw new Error(`no consumer found for: ${topic}`)
    }

    commit('checkActivityConsumer', topic)

    if (consumer.died) {
      await dispatch('resurrectConsumer', {topic})
    }

    try {
      let {data: messages} = await consumer.request.get(`/records`, {
        headers: {
          ...utils.getFormatHeaders(consumer.format)
        },
        params: {
          max_bytes: bytes,
          timeout
        }
      })

      commit('updateConsumerActivity', topic)

      // Parse the kafka messages
      messages = messages.map((message) => {
        if (message.value) {
          const [format, localFormat] = consumer.format.split('+')
          switch (format) {
            case 'binary':
              message.value = atob(message.value)

              switch (localFormat) {
                case 'json':
                  message.value = JSON.parse(message.value)
              }
              break
          }
        }

        return message
      })

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
        return
      }

      throw error
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
    const url = `${baseURL}/consumers/${group}/instances/${name}`

    Vue.set(state.consumers, topic, {
      request: axios.create({
        baseURL: url,
        headers: {
          'Content-Type': CONTENT_JSON_KAFKA
        }
      }),
      url,
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
   * @param  {String}     topic    Name of the topic
   * @param  {Array<any>} messages Messages to be appended
   */
  append (state, {topic, messages}) {
    if (!state.messages[topic]) {
      Vue.set(state.messages, topic, [])
    }

    state.messages[topic].push(...messages)
  },
  /**
   * Flush all the consumed messages of the given topic.
   * @param  {String} topic Namf of the topic
   */
  flushConsumed (state, topic) {
    Vue.delete(state.messages, topic)
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
