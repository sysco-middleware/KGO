<template>
  <div class="columns">
    <div class="column col-4">
      <ul class="menu">
        <li class="menu-item">
          <div class="tile tile-centered">
            <div class="tile-content">
              {{total}} Topics
            </div>
          </div>
        </li>
        <li class="divider"></li>

        <li class="menu-item">
          <div class="menu-badge">
            <label class="label label-rounded label-primary">AVRO</label>
          </div>
          <router-link :to="{ name: 'topic', params: { topic: 'kafka_topic' }}" active-class="active" class="c-hand">
            reddit_posts
          </router-link>
        </li>

        <li class="menu-item">
          <ul class="pagination flex-center paginate-links schemas" per="5">
            <li class="left-arrow disabled page-item c-hand">
              <a>Previous</a>
            </li>
            <li class="number active page-item c-hand">
              <a>1</a></li>
            <li class="right-arrow disabled page-item c-hand">
              <a>Next</a>
            </li>
          </ul>
        </li>

        <div v-if="schemasAsArray.length <= 0" class="empty">
          <p class="empty-title h5">You have no schemas</p>
          <p class="empty-subtitle">Click the button to create a schema.</p>
          <div class="empty-action">
            <router-link :to="{ name: 'new/schema', params: {} }">
              <button class="btn btn-primary">New schema</button>
            </router-link>
          </div>
        </div>
      </ul>
    </div>
    <div class="column col-8">
      <router-view :key="$route.fullPath"></router-view>
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
