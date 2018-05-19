<template>
  <div>
    <Schema v-for="user of users" :key="user.id" :id="user.id" :name="user.first_name"/>
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
    ...mapState('schemas', [
      'users'
    ])
  },
  created () {
    this.$store.dispatch('schemas/fetchAllUsers')
  }
}
</script>
