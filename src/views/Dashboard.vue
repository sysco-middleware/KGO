<template>
  <div>
    <span v-for="subject of subjects" :key="subject">
      <span v-if="info[subject]">(#{{info[subject].latest.id}})</span> {{subject}}
    </span>
  </div>
</template>

<script>
// @ is an alias to /src
import Schema from '@/components/Schema.vue'
import { mapState } from 'vuex'

export default {
  name: 'dashboard',
  components: {
    Schema
  },
  computed: {
    ...mapState('subjects', {
      subjects: 'availible',
      info: 'info'
    })
  },
  watch: {
    subjects () {
      for (let subject of this.subjects) {
        this.$store.dispatch('subjects/fetchLatest', subject)
      }
    }
  },
  async created () {
    await this.$store.dispatch('subjects/fetchAvailible')
  }
}
</script>
