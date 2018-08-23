<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white">
      <div class="columns f-middle">
        <div class="column col-6">
          <div class="panel-title h5 mt-10 text-overflow-ellipsis">Topic: {{name}}</div>
        </div>
        <div class="column col-ml-auto d-flex f-end">
          <div class="form-group">
            <select class="form-select form-inline text-dark" :disabled="!hasConsumer" @change="autoUpdate(intervalSelection)" v-model="intervalSelection">
              <option :value="0">Auto updating disabled</option>
              <option v-for="seconds of intervalOptions" :value="seconds" :key="seconds">Update every {{seconds}} seconds</option>
            </select>
          </div>

          <button class="btn btn-action tooltip tooltip-bottom" @click="fetchConsumed()" data-tooltip="Fetch the latest consumed messages" :disabled="!hasConsumer">
            <i class="icon icon-refresh"></i>
          </button>
        </div>
      </div>
    </div>
    <Tabs nav="panel-nav" body="panel-body" name="topic" remember>
      <Tab :name="`Data (${consumedMessages.length})`" class="flush-padding">
        <div v-if="!topic.format" class="empty">
          <p class="empty-title h5">Unknown value format</p>
          <p class="empty-subtitle">Please select the message value format of this topic.</p>
          <div class="empty-action columns">
            <div class="column col-6 col-mx-auto">
              <div class="btn-group btn-group-block">
                <button class="btn" @click="setTopicFormat('binary+json')">Binary+JSON</button>
                <button class="btn" @click="setTopicFormat('binary')">Binary</button>
                <button class="btn" @click="setTopicFormat('json')">JSON</button>
                <button class="btn" @click="setTopicFormat('avro')">AVRO</button>
              </div>
            </div>
          </div>
        </div>

        <div class="empty" v-if="(!hasMessages && !unknownError) && topic.format">
          <div class="loading loading-lg"></div>
        </div>

        <template v-if="topic.format">
          <Tabs nav="panel-nav" body="panel-body" name="topic-data" remember v-if="hasMessages || unknownError">
            <div class="columns panel-body flush-padding-bottom">
              <!-- <div class="column col-xs">
                <form class="input-group" @submit.prevent="preformFilter()">
                  <input type="text" class="form-input" placeholder="Filter consumed messages" v-model="filterQuery">
                  <button class="btn btn-primary input-group-btn" submit>Filter</button>
                </form>
              </div> -->

              <div class="column col-xs">
                <div class="form-group">
                  <select class="form-select form-inline text-dark" :disabled="!hasConsumer" @change="setConsumingMaxBytes(consumingMaxBytes)" v-model="consumingMaxBytes">
                    <option v-for="byte of consumingBytesOptions" :value="byte" :key="byte">Consuming max {{byte}} bytes at a time</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="columns panel-body flush-padding-bottom">
              <div class="column col-xs">
                <form class="input-group" @submit.prevent="onSeekToOffset()">
                  <input type="number" class="form-input" placeholder="Offset" v-model="seekOffsetInput">
                  <button class="btn btn-primary input-group-btn" submit>Seek to offset</button>
                </form>
              </div>

              <div class="column col-xs">
                <div class="btn-group btn-group-block">
                  <button class="btn" @click="onOffsetBeginning()">Seek to beginning</button>
                  <button class="btn" @click="onOffsetEnd()">Seek to end</button>
                </div>
              </div>
            </div>

            <Tab name="Table">
              <MessageTable :messages="consumedMessages" v-show="hasMessages" />
            </Tab>
            <Tab name="RAW">
              <TopicEditor :content="consumedMessages" v-show="hasMessages" />
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
import MessageTable from '@/components/MessageTable.vue'

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
    hasMessages () {
      return Boolean(this.consumedMessages.length > 0 || this.consumerReturned)
    }
  },
  components: {
    Tab,
    Tabs,
    TopicEditor,
    MessageTable
  },
  data () {
    const {topic} = this.$route.params
    return {
      name: topic,
      updateInterval: 0,
      intervalSelection: 0,
      seekOffsetInput: null,
      intervalOptions: [
        2,
        5,
        60
      ],
      consumingMaxBytes: 5000,
      consumingBytesOptions: [
        5000,
        10000,
        50000,
        100000
      ],
      unknownError: false,
      consumerReturned: false
    }
  },
  async created () {
    await this.$store.dispatch('topics/fetch', this.name)

    // If a topic's format is available create a consumer
    if (this.topic.format) {
      await this.setupConsumer()
    }
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

      await this.setupConsumer()
    },
    /**
     * Sets up the consumer and starts fetching consumed messages.
     * This method is mainly used to initialize a consumer once the page is loaded.
     */
    async setupConsumer () {
      await this.createConsumer()
      await this.setOffsetBeginning()
      await this.fetchConsumed()
    },
    /**
     * Create a new consumer
     */
    async createConsumer () {
      await this.$store.dispatch('messages/consumer', {
        format: this.topic.format,
        name: this.name,
        topic: this.name,
        config: {
          'auto.offset.reset': 'earliest',
          'auto.commit.enable': false
        }
      })

      await this.assignToPartitions()
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
      const interval = this.intervalSelection * 1000
      let timeout = 5 * 1000 // Max timeout = 5 sec

      // If the interval is faster then the timeout set the interval as timeout
      if (interval > 0 && interval < timeout) {
        timeout = interval
      }

      try {
        await this.$store.dispatch('messages/fetch', {
          topic: this.name,
          bytes: this.consumingMaxBytes,
          timeout
        })

        this.consumerReturned = true
      } catch (error) {
        if (!error.response) {
          this.$notify({
            message: String(error),
            type: 'error'
          })
          return
        }

        const {data} = error.response || {}
        const {error_code: errorCode, message} = data || {}

        this.$notify({
          message: `${errorCode} - ${message}`,
          type: 'error'
        })

        this.unknownError = true
      }
    },
    /**
     * Assign all partitions of the given topic to the active consumer
     */
    async assignToPartitions () {
      const topic = this.name
      await this.$store.dispatch('messages/assignToPartitions', topic)
    },
    /**
     * This method get's called once a user requests to seek to the beginning
     * of a topic.
     */
    async onOffsetBeginning () {
      await this.revokeConsumer()
      await this.createConsumer()
      await this.setOffsetBeginning()
      await this.fetchConsumed()
    },
    /**
     * Sets the offset of the active topic consumer to the beginning.
     * Make sure to assign the partitions first.
     */
    async setOffsetBeginning () {
      const topic = this.name
      await this.$store.dispatch('messages/setOffsetBeginning', topic)
    },
    /**
     * This method get's called once a user requests to seek to the end
     * of a topic.
     */
    async onOffsetEnd () {
      await this.revokeConsumer()
      await this.createConsumer()
      await this.setOffsetEnd()
      await this.fetchConsumed()
    },
    /**
     * Sets the offset of the active topic consumer to the end.
     * Make sure to assign the partitions first.
     */
    async setOffsetEnd () {
      const topic = this.name
      await this.$store.dispatch('messages/setOffsetEnd', topic)
    },
    /**
     * Revoke the given consumer
     */
    async revokeConsumer () {
      const topic = this.name
      await this.$store.dispatch('messages/revokeConsumer', topic)
    },
    /**
     * The method get's called once a users requests to seek
     * to the given offset of a topic
     */
    async onSeekToOffset () {
      await this.revokeConsumer()
      await this.createConsumer()
      await this.seekToOffset()
      await this.fetchConsumed()
    },
    /**
     * Seek to the set offset
     */
    async seekToOffset () {
      const offset = this.seekOffsetInput
      const topic = this.name
      await this.$store.dispatch('messages/seekToOffset', {offset, topic})
    }
  },
  beforeDestroy () {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  }
}
</script>
