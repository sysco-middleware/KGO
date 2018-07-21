<template>
  <div>
    <button v-if="selected" @click="exportTopic()" class="btn" :disabled="consumedMessages.length <= 0">Export Topic</button>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import * as utils from '@/lib/utils'

export default {
  computed: {
    ...mapState('messages', [
      'messages'
    ]),
    consumedMessages () {
      return this.messages[this.selected] || []
    }
  },
  watch: {
    '$route.params' () {
      const {params} = this.$route
      this.selected = params.topic
    }
  },
  data () {
    const {params} = this.$route
    return {
      selected: params.topic
    }
  },
  methods: {
    exportTopic () {
      if (!this.selected) {
        return
      }

      const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.consumedMessages))}`
      const name = `${this.selected}.json`

      utils.download(data, name)
    }
  }
}
</script>
