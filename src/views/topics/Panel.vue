<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white">
      <div class="columns flex-middle">
        <div class="column">
          <div class="panel-title h5 mt-10">Topic: {{name}}</div>
          <div class="panel-subtitle"></div>
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

        <Tabs v-if="topic.format" nav="panel-nav" body="panel-body" name="topic-data" remember>
          <Tab name="Table">
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
              <tbody>
                <tr>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                  <td>true</td>
                  <td>true</td>
                </tr>
                <tr>
                  <td class="text-center">1</td>
                  <td class="text-center">0</td>
                  <td class="text-center">0</td>
                  <td>false</td>
                  <td>true</td>
                </tr>
              </tbody>
            </table>
          </Tab>
          <Tab name="RAW">
            <TopicEditor :content="consumedMessages" />
          </Tab>
        </Tabs>
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
      'messages'
    ]),
    topic () {
      return this.topics[this.name] || {}
    },
    totalPartitions () {
      const topic = this.topic
      return topic.partitions ? topic.partitions.length : 0
    },
    replicationFactor () {
      const topic = this.topic || {}
      const [partition] = topic.partitions || []

      return partition ? partition.replicas.length : 0
    },
    consumedMessages () {
      return this.messages[this.name] || []
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
      name: topic
    }
  },
  async created () {
    await this.$store.dispatch('topics/fetch', this.name)
  },
  methods: {
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

      await this.update()
    },
    async update () {
      await this.$store.dispatch('messages/fetch', { topic: this.name })
    }
  }
}
</script>
