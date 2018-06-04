<template>
  <div class="container">
    <header class="navbar">
      <section class="navbar-section">
        <a href="#" class="btn btn-link">Docs</a>
        <a href="#" class="btn btn-link">Examples</a>
      </section>
      <section class="navbar-center">
        <!-- centered logo or brand -->
      </section>
      <section class="navbar-section">
        <button class="btn">Export Schemas</button>
      </section>
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
