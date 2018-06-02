<template>
  <div class="columns">
    <div class="column col-4">
      <ul class="menu">
        <li class="menu-item">
          <div class="tile tile-centered">
            <div class="tile-content">
              {{total}} Schemas
            </div>

            <router-link :to="{ name: 'new/schema' }">
              <button class="btn float-right">New</button>
            </router-link>
          </div>
        </li>
        <li class="divider"></li>
        <paginate name="schemas" :list="schemasAsArray" :per="5" tag="div">
          <li class="menu-item" v-for="{key, schema} of paginated('schemas')">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v{{schema.version}}</label>
            </div>
            <router-link :to="{ name: 'schema', params: { subject: key }}" active-class="active" class="c-hand" :class="{active: key === selected}">{{key}}</router-link>
          </li>
        </paginate>

        <li class="menu-item">
          <paginate-links
            class="pagination flex-center"
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
