<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white">
      <div class="columns flex-middle">
        <div class="column">
          <div class="panel-title h5 mt-10">Schema: {{subject}}</div>
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
        <Editor :content="JSON.stringify(selected.schema, null, '\t')" />
      </Tab>
      <Tab name="Fields">
        <table class="table table-striped table-scroll table-inline">
          <thead>
            <tr>
              <th>name</th>
              <th>type</th>
              <th>default</th>
              <th>documentation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) of selected.schema.fields" :key="index">
              <td>{{row.name}}</td>
              <td>{{row.type}}</td>
              <td>{{row.default}}</td>
              <td>{{row.doc}}</td>
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
    subject: {
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
      return this.subjects[this.subject]
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
    subject () {
      this.version = this.latest
    }
  }
}
</script>
