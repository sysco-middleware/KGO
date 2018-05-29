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
                5 Schemas
              </div>

              <button class="btn float-right">New</button>
            </div>
          </li>
          <li class="divider"></li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.2</label>
            </div>
            <a href="#menus" class="active">events</a>
          </li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.1</label>
            </div>
            <a href="#menus">commands</a>
          </li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.1</label>
            </div>
            <a href="#menus">emails</a>
          </li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.2</label>
            </div>
            <a href="#menus">reddit_posts</a>
          </li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.1</label>
            </div>
            <a href="#menus">reddit_posts-keys</a>
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
        </ul>
      </div>
      <div class="column col-8">
        <div class="panel">
          <div class="panel-header text-center">
            <div class="panel-title h5 mt-10">events</div>
            <div class="panel-subtitle">id: 2, v.1</div>
          </div>
          <nav class="panel-nav">
            <ul class="tab tab-block">
              <li class="tab-item">
                <a href="#panels">Schema</a>
              </li>
              <li class="tab-item">
                <a href="#panels">Info</a>
              </li>
              <li class="tab-item active" @click="selected='config'">
                <a href="#panels">Config</a>
              </li>
              <li class="tab-item" @click="selected='history'">
                <a href="#panels">History</a>
              </li>
            </ul>
          </nav>
          <div class="panel-body" v-if="selected == 'config'">
            <table class="table table-striped table-scroll">
              <thead>
                <tr>
                  <th>name</th>
                  <th>type</th>
                  <th>default</th>
                  <th>documentation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>payment_type</td>
                  <td>int</td>
                  <td>0</td>
                  <td>A numeric code signifying how the passenger paid for the trip. 1: Credit card 2: Cash 3: No charge 4: Dispute 5: Unknown 6: Voided trip</td>
                </tr>
                <tr>
                  <td>trip_distance</td>
                  <td>double</td>
                  <td>0.0</td>
                  <td>The elapsed trip distance in miles reported by the taximeter.</td>
                </tr>
                <tr>
                  <td>tpep_dropoff_datetime</td>
                  <td>string</td>
                  <td></td>
                  <td>The date and time when the meter was disengaged.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="panel-body" v-if="selected == 'history'">
            <code>
    },
    {
      "name": "number3",
      "type": "float",
      "default": 1
            </code>
            <div class="divider text-center" data-content="DIFF"></div>
            <code>
    {
  "type": "record",
  "name": "evolution",
  "namespace": "com.landoop",
  "doc": "This is a sample Avro schema to get you started. Please edit",
  "fields": [
    {
      "name": "name",
      "type": "string"
    },
    {
      "name": "number1",
      "type": "int"
    },
    {
      "name": "number2",
      "type": "float"
    }
  ]
}
            </code>
          </div>
          <div class="panel-footer">
            <!-- <button class="btn btn-primary btn-block">Save</button> -->
          </div>
        </div>
      </div>
    </div>
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
  data () {
    return {
      selected: 'config'
    }
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
