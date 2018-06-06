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
        <SchemaEditor :content.sync="schema" />
      </Tab>
      <Tab name="Info">
        <Info :schema="schema" />
      </Tab>
      <Tab name="Config">
        <Config />
      </Tab>
      <Tab name="Diff" :show="showDiff">
        <div class="columns mb-2">
          <div class="column">
            <div class="form-group">
              <select class="form-select select-sm" v-model="compare.left">
                <option v-for="version of versions" :key="version" :value="version">v{{version}}</option>
              </select>
            </div>
          </div>

          <div class="column">
            <div class="divider-vert"></div>
          </div>

          <div class="column">
            <div class="form-group">
              <select class="form-select select-sm" v-model="compare.right">
                <option v-for="version of versions" :key="version" :value="version">v{{version}}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- <DiffEditor
          v-if="showDiff"
          mode="ace/mode/json"
          :left="schemas[compare.left].schema"
          :right="schemas[compare.right].schema"
          class="relative" /> -->
      </Tab>
    </Tabs>

    <div class="panel-footer columns">
      <div class="column">
        <button class="btn btn-block">Validate</button>
      </div>
      <div class="column">
        <button class="btn btn-block btn-primary">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import SchemaEditor from '@/components/SchemaEditor.vue'
import DiffEditor from '@/components/DiffEditor.vue'
import Info from '@/views/schemas/Info.vue'
import Config from '@/views/schemas/Config.vue'

export default {
  components: {
    Tab,
    Tabs,
    SchemaEditor,
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
    showDiff () {
      return this.versions.length > 1
    },
    latest () {
      return Math.max(...this.versions)
    },
    selected () {
      return this.version && this.schemas ? this.schemas[this.version] : null
    }
  },
  watch: {
    selected () {
      this.schema = this.selected.schema
    }
  },
  data () {
    const {subject} = this.$route.params
    return {
      subject,
      version: 0,
      schema: {},
      compare: {
        left: 0,
        right: 0
      }
    }
  },
  mounted () {
    this.version = this.latest

    this.compareLeft = this.versions.length > 1 ? this.latest - 1 : 0
    this.compareRight = this.latest
  }
}
</script>
