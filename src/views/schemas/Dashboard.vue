\<template>
  <div class="columns">
    <div class="column col-4">
      <ul class="menu">
        <li class="menu-item">
          <div class="tile tile-centered">
            <div class="tile-content">
              {{total}} Subjects
            </div>

            <router-link :to="{ name: 'new/schema' }">
              <button class="btn float-right">New</button>
            </router-link>
          </div>
        </li>
        <li class="divider"></li>

        <div v-if="schemasAsArray.length > 0">
          <paginate name="schemas" :list="schemasAsArray" :per="8" tag="div">
            <li class="menu-item" v-for="{key, schema} of paginated('schemas')" :key="key">
              <div class="menu-badge" v-if="schema.version">
                <label class="label label-rounded label-primary">v{{schema.version}}</label>
              </div>
              <router-link :to="{ name: 'schema', params: { subject: key }}" active-class="active" class="c-hand">{{key}}</router-link>
            </li>
          </paginate>

          <li class="menu-item">
            <paginate-links
              class="pagination f-center"
              for="schemas"
              :per="5"

              :show-step-links="true"
              :step-links="{
                next: 'Next',
                prev: 'Previous'
              }"

              :classes="{
                'li': ['page-item', 'c-hand']
              }">
            </paginate-links>
          </li>
        </div>

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

      <div class="mt-2">
        <p>Global compatibility level: <b>{{global.config.compatibility || 'unknown'}}</b></p>
      </div>
    </div>
    <div class="column col-8">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters({
      schemas: 'schemas/latest'
    }),
    ...mapState('schemas', [
      'global'
    ]),
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
    await this.$store.dispatch('schemas/fetchAvailable')
    await this.$store.dispatch('schemas/fetchGlobalConfig')
  },
  methods: {
    selectSchema (schema) {
      this.selected = schema
    }
  }
}
</script>
