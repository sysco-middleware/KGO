<template>
  <div class="panel" v-if="selected">
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
        <Editor :content="jsonToString(selected.schema)" />
      </Tab>
      <Tab name="Info">
        <div class="card">
          <div class="card-header">
            <div class="tile-title" v-if="selected.schema.type"><b>Type:</b> {{selected.schema.type}}</div>
            <div class="tile-title" v-if="selected.schema.record"><b>Record:</b> {{selected.schema.record}}</div>
            <div class="tile-title" v-if="selected.schema.namespace"><b>Namespace:</b> {{selected.schema.namespace}}</div>
          </div>
          <div class="card-body text-gray" v-if="selected.schema.doc">
            {{selected.schema.doc}}
          </div>
        </div>

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
      <Tab name="Config">
      </Tab>
      <Tab name="Diff">
        <div class="columns mb-2">
          <div class="column">
            <div class="form-group">
              <select class="form-select select-sm" v-model="compareLeft">
                <option v-for="version of versions" :key="version" :value="version">v{{version}}</option>
              </select>
            </div>
          </div>

          <div class="column">
            <div class="divider-vert"></div>
          </div>

          <div class="column">
            <div class="form-group">
              <select class="form-select select-sm" v-model="compareRight">
                <option v-for="version of versions" :key="version" :value="version">v{{version}}</option>
              </select>
            </div>
          </div>
        </div>

        <Diff :left="jsonToString(schemas[compareLeft])" :right="jsonToString(schemas[compareRight])" />
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import Editor from '@/components/Editor.vue'
import Diff from '@/components/Diff.vue'

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
    Editor,
    Diff
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
      version: 0,
      compareLeft: 0,
      compareRight: 0
    }
  },
  mounted () {
    this.initPanel()
  },
  watch: {
    subject () {
      this.initPanel()
    }
  },
  methods: {
    jsonToString (json) {
      return JSON.stringify(json, null, '\t')
    },
    initPanel () {
      this.version = this.latest

      this.compareLeft = this.versions.length > 1 ? this.latest - 1 : 0
      this.compareRight = this.latest
    }
  }
}
</script>
