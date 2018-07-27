<template>
  <div>
    <button v-if="selected" class="btn" @click="exportSchema()">Export Schemas</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as utils from '@/lib/utils'

export default {
  computed: {
    ...mapState('schemas', [
      'subjects'
    ]),
    subject () {
      return this.subjects[this.selected] || {}
    }
  },
  data () {
    const {params} = this.$route
    return {
      selected: params.subject
    }
  },
  watch: {
    '$route.params' () {
      const {params} = this.$route
      this.selected = params.subject
    }
  },
  methods: {
    exportSchema () {
      if (!this.selected) {
        return
      }

      const url = URL.createObjectURL(new Blob([JSON.stringify(this.subject, null, '\t')]), {
        type: 'data:text/json;charset=utf-8'
      })
      const name = `${this.selected}.json`

      utils.download(url, name)
    }
  }
}
</script>
