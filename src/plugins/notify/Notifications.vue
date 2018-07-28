<template>
  <div class="toast-notification">
    <div v-for="item of queue" :key="item.id" class="toast" :class="[`toast-${item.type}`]">
      <button class="btn btn-clear float-right" @click="remove(item.id)"></button>
      {{item.message}}
    </div>
  </div>
</template>

<script>
import events from './events'

export default {
  data () {
    return {
      queue: [],
      id: 0
    }
  },
  created () {
    events.$on('notify', this.notify)
  },
  methods: {
    notify (options) {
      options.id = this.id++

      if (!options.type) {
        options.type = 'primary'
      }

      this.queue.push(options)

      setTimeout(() => {
        this.remove(options.id)
      }, options.timeout || 5 * 1000)
    },
    remove (id) {
      const index = this.queue.findIndex((item) => {
        return item.id === id
      })

      if (index < 0) {
        return
      }

      this.queue.splice(index, 1)
    }
  }
}
</script>
