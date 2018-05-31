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

    <div class="columns cpp-schemas">
      <div class="column col-4">
        <ul class="menu">
          <li class="menu-item">
            <div class="tile tile-centered">
              <div class="tile-content">
                {{total}} Schemas
              </div>

              <button class="btn float-right">New</button>
            </div>
          </li>
          <li class="divider"></li>
          <div>
            <li class="menu-item" v-for="(schema, key) of schemas" :key="schema.id">
              <div class="menu-badge">
                <label class="label label-rounded label-primary">v{{schema.version}}</label>
              </div>
              <a @click="selectSchema(key)" class="c-hand" :class="{active: key === selected}">{{key}}</a>
            </li>
            <li class="menu-item">
              <ul class="pagination flex-center">
                <li class="page-item disabled">
                  <a href="#" tabindex="-1">Previous</a>
                </li>
                <li class="page-item active">
                  <a href="#">1</a>
                </li>
                <li class="page-item">
                  <a href="#">2</a>
                </li>
                <li class="page-item">
                  <a href="#">3</a>
                </li>
                <li class="page-item">
                  <span>...</span>
                </li>
                <li class="page-item">
                  <a href="#">12</a>
                </li>
                <li class="page-item">
                  <a href="#">Next</a>
                </li>
              </ul>
            </li>
          </div>
        </ul>
      </div>
      <div class="column col-8">
        <SchemaPanel v-if="selected" :subject="selected" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import SchemaPanel from '@/views/schema/Panel.vue'

export default {
  name: 'dashboard',
  components: {
    SchemaPanel
  },
  computed: {
    ...mapGetters({
      schemas: 'schemas/latest'
    }),
    total () {
      return Object.keys(this.schemas).length // Get the total ammount of keys since schemas is a object
    }
  },
  data () {
    return {
      selected: ''
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
