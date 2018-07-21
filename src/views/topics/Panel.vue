<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white">
      <div class="columns f-middle">
        <div class="column col-6">
          <div class="panel-title h5 mt-10 text-overflow-ellipsis">Topic: {{name}}</div>
          <div class="panel-subtitle"></div>
        </div>
        <div class="column col-ml-auto d-flex f-end">
          <div class="form-group">
            <select class="form-select form-inline text-dark" :disabled="!hasConsumer" @change="autoUpdate(intervalSelection)" v-model="intervalSelection">
              <option value selected>Auto updating disabled</option>
              <option value="1">Update every second</option>
              <option value="5">Update every 5 seconds</option>
              <option value="60">Update every minute</option>
            </select>
          </div>

          <button class="btn btn-action tooltip tooltip-bottom" @click="fetchConsumed()" data-tooltip="Fetch the latest consumed messages" :disabled="!hasConsumer">
            <i class="icon icon-refresh"></i>
          </button>
        </div>
      </div>
    </div>
    <Tabs nav="panel-nav" body="panel-body" name="topic" remember>
      <Tab name="Data" class="flush-padding">
        <div v-if="!topic.format" class="empty">
          <p class="empty-title h5">Unknown value format</p>
          <p class="empty-subtitle">Please select the message value format of this topic.</p>
          <div class="empty-action columns">
            <div class="column col-6 col-mx-auto">
              <div class="btn-group btn-group-block">
                <button class="btn" @click="setTopicFormat('binary')">Binary</button>
                <button class="btn" @click="setTopicFormat('json')">JSON</button>
              </div>
            </div>
          </div>
        </div>

        <template v-if="topic.format">
          <Tabs nav="panel-nav" body="panel-body" name="topic-data" remember>
            <Tab name="Table">
              <table class="table table-striped table-scroll table-inline">
                <thead>
                  <tr>
                    <th v-for="(header, index) of messagesTable.headers" :key="index">{{header}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(content, index) of messagesTable.content" :key="index">
                    <td v-for="(column, key) of content" :key="key">{{column}}</td>
                  </tr>
                </tbody>
              </table>
            </Tab>
            <Tab name="RAW">
              <TopicEditor :content="consumedMessages" />
            </Tab>
          </Tabs>
        </template>
      </Tab>
      <Tab :name="`Partitions (${totalPartitions})`">
        <div class="card">
          <div class="card-header">
            <div class="tile-title"><b>Number of Partitions:</b> {{totalPartitions}}</div>
            <div class="tile-title"><b>Replication Factor:</b> {{replicationFactor}}</div>
          </div>
        </div>

        <table class="table table-striped table-scroll table-inline">
          <thead>
            <tr>
              <th class="text-center">Partition</th>
              <th class="text-center">Replica</th>
              <th class="text-center">Replica broker</th>
              <th>Is Leader</th>
              <th>Is in-sync</th>
            </tr>
          </thead>
          <tbody v-for="partition of topic.partitions" :key="partition.partition">
            <tr v-for="(replica, id) of partition.replicas" :key="id">
              <td class="text-center">{{partition.partition}}</td>
              <td class="text-center">{{id}}</td>
              <td class="text-center">{{replica.broker}}</td>
              <td>{{replica.leader}}</td>
              <td>{{replica.in_sync}}</td>
            </tr>
          </tbody>
        </table>
      </Tab>
      <Tab name="Config">
        <table class="table table-striped table-scroll table-inline">
          <thead>
            <tr>
              <th>Config</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) of topic.configs" :key="key">
              <td>{{key}}</td>
              <td>{{value}}</td>
            </tr>
          </tbody>
        </table>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import {mapState} from 'vuex'

import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import TopicEditor from '@/components/TopicEditor.vue'

export default {
  computed: {
    ...mapState('topics', [
      'topics'
    ]),
    ...mapState('messages', [
      'messages',
      'consumers'
    ]),
    /**
     * Check if the given topic has a consumer
     * @return {Boolean} Checksum result
     */
    hasConsumer () {
      const topic = this.name
      return Boolean(this.consumers[topic])
    },
    /**
     * Returns information about the current topic.
     * If the topic is not found is a empty Object returned.
     * @return {Object} Info about the topic
     */
    topic () {
      const topic = this.name
      return this.topics[topic] || {}
    },
    /**
     * Simply returns the total ammount of partitions available
     * @return {Number} Total ammount of partitions
     */
    totalPartitions () {
      const topic = this.topic
      return topic.partitions ? topic.partitions.length : 0
    },
    /**
     * Returns the replication factor of the topic
     * @return {Number} Replication factor
     */
    replicationFactor () {
      const topic = this.topic || {}
      const [partition] = topic.partitions || []

      return partition ? partition.replicas.length : 0
    },
    /**
     * Returns the consumed messaged from the consumer.
     * If no messages are found is a empty array returned.
     * @return {Array} Consumed messages
     */
    consumedMessages () {
      return this.messages[this.name] || []
    },
    /**
     * Message table contains all the messages
     * in a table friendly dataset
     * @return {Object} The messages table dataset
     */
    messagesTable () {
      let table = {
        headers: ['offset', 'partition'],
        content: []
      }

      for (let message of this.consumedMessages) {
        let row = [message.offset, message.partition]

        switch (message.value ? message.value.constructor : null) {
          case Object:
            // TODO: parse JSON messages
            break
          default:
            if (!table.headers.includes('value')) {
              table.headers.push('value')
            }

            row.push(message.value)
            break
        }

        table.content.push(row)
      }

      return table
    }
  },
  components: {
    Tab,
    Tabs,
    TopicEditor
  },
  data () {
    const {topic} = this.$route.params
    return {
      name: topic,
      updateInterval: null,
      intervalSelection: ""
    }
  },
  async created () {
    await this.$store.dispatch('topics/fetch', this.name)
  },
  methods: {
    /**
     * Set the topic value format of the active topic and create a representing consumer.
     * @param  {String}  [format='binary'] Format of the given topic
     * @return {Promise}                   This promise get's resolved once the format is set a consumer is created and the first consumed messages are fetched
     */
    async setTopicFormat (format = 'binary') {
      this.$store.commit('topics/format', {
        format,
        topic: this.name
      })

      await this.$store.dispatch('messages/consumer', {
        format,
        name: this.name,
        topic: this.name,
        config: {
          'auto.offset.reset': 'smallest'
        }
      })

      await this.fetchConsumed()
    },
    /**
     * Set a auto update interval that fetches the latest
     * consumed messages ever x seconds.
     * @param  {Number} interval Interval occurence in seconds
     */
    autoUpdate (interval) {
      if (this.updateInterval) {
        clearInterval(this.updateInterval)
      }

      if (!interval) {
        return
      }

      this.updateInterval = setInterval(() => {
        this.fetchConsumed()
      }, interval * 1000)
    },
    /**
     * Fetch the latest consumed messages from the active consumer
     * @return {Promise} The promise gets resolved once the messages are fetched
     */
    async fetchConsumed () {
      await this.$store.dispatch('messages/fetch', { topic: this.name })
    }
  },
  beforeDestroy () {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  }
}
</script>
