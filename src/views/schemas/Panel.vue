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
            <select class="form-select select-sm" v-model="version" :disabled="versions.length <= 1">
              <option v-for="version of versions" :key="version" :value="version">v{{version}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <Tabs nav="panel-nav" body="panel-body" name="schema" remember>
      <Tab name="Schema">
        <Editor :content="jsonToString(selected.schema)" />
      </Tab>
      <Tab name="Info">
        <Info :schema="selected.schema" />
      </Tab>
      <Tab name="Config">
        <Config />
      </Tab>
      <Tab name="Diff" :show="versions.length > 1">
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

        <DiffEditor
          mode="ace/mode/json"
          :left="jsonToString(schemas[compareLeft])"
          :right="jsonToString(schemas[compareRight])"
          class="relative" />
      </Tab>
    </Tabs>

    <div class="panel-footer">
      <button class="btn btn-block">Update</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import Editor from '@/components/Editor.vue'
import DiffEditor from '@/components/DiffEditor.vue'
import Info from '@/views/schemas/Info.vue'
import Config from '@/views/schemas/Config.vue'

export default {
  components: {
    Tab,
    Tabs,
    Editor,
    DiffEditor,
    Info,
    Config
  },
  computed: {
    ...mapState('schemas', [
      'subjects'
    ]),
    schemas () {
      const {subject} = this.$route.params
      return this.subjects[subject]
    },
    versions () {
      return Object.keys(this.schemas || {})
    },
    latest () {
      return Math.max(...this.versions)
    },
    selected () {
      return this.version && this.schemas ? this.schemas[this.version] : null
    }
  },
  data () {
    const {subject} = this.$route.params
    return {
      subject,
      version: 0,
      compareLeft: 0,
      compareRight: 0,
      compatibilityLevel: 'none'
    }
  },
  mounted () {
    this.version = this.latest

    this.compareLeft = this.versions.length > 1 ? this.latest - 1 : 0
    this.compareRight = this.latest
  },
  methods: {
    init () {

    },
    jsonToString (json) {
      return JSON.stringify(json, null, '\t')
    }
  }
}
</script>
