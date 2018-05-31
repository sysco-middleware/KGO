<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white">
      <div class="columns flex-middle">
        <div class="column">
          <div class="panel-title h5 mt-10">Schema: {{schema}}</div>
          <div class="panel-subtitle">ID: {{selected.id}}</div>
        </div>
        <div class="column">
          <div class="form-group text-dark">
            <select class="form-select select-sm" v-model="version">
              <option v-for="version of versions" :key="version" :value="version">v{{version}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <Tabs nav="panel-nav" body="panel-body">
      <Tab name="Schema">
        <Editor :content="selected.schema" />
      </Tab>
      <Tab name="Info">
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
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import Editor from '@/components/Editor.vue'

export default {
  props: {
    schema: {
      type: String,
      required: true
    }
  },
  components: {
    Tab,
    Tabs,
    Editor
  },
  computed: {
    ...mapState('schemas', [
      'subjects'
    ]),
    schemas () {
      return this.subjects[this.schema]
    },
    versions () {
      return Object.keys(this.schemas)
    },
    latest () {
      return Math.max(...this.versions)
    },
    selected () {
      return this.schemas[this.version]
    }
  },
  data () {
    return {
      version: 0
    }
  },
  created () {
    this.version = this.latest
  },
  watch: {
    schema () {
      this.version = this.latest
    }
  }
}
</script>
