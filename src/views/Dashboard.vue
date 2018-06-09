<template>
  <div class="container">
    <header class="navbar">
      <section class="navbar-section">
        <router-link :to="{ name: 'schemas' }" class="btn btn-link">Schemas</router-link>
        <router-link :to="{ name: 'topics' }" class="btn btn-link">Topics</router-link>
        <router-link :to="{ name: 'topologies' }" class="btn btn-link">Topologies</router-link>
      </section>
      <section class="navbar-center">
        <!-- centered logo or brand -->
      </section>
      <router-view class="navbar-section" name="navigation"></router-view>
    </header>

    <router-view class="cpp-view"></router-view>

    <div class="toast toast-primary toast-notification">
      <button class="btn btn-clear float-right"></button>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters({
      schemas: 'schemas/latest'
    }),
    total () {
      return Object.keys(this.schemas).length // Get the total ammount of keys since schemas is a object
    },
    schemasAsArray () {
      const keys = Object.keys(this.schemas)
      let array = []

      for (let key of keys) {
        array.push({
          key,
          schema: this.schemas[key]
        })
      }

      return array
    }
  },
  data () {
    return {
      selected: '',
      paginate: ['schemas']
    }
  },
  async created () {
    // await this.$store.dispatch('schemas/fetchAvailible')
    // await this.$store.dispatch('schemas/fetchAllVersions')
  },
  methods: {
    selectSchema (schema) {
      this.selected = schema
    }
  }
}
</script>
