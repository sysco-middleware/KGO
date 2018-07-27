<template>
  <div class="panel" v-if="selected">
    <div class="panel-header bg-primary text-white">
      <div class="columns f-middle">
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
        <SchemaEditor :content.sync="schema" @change="compatible = false" />

        <div class="columns mt-2">
          <div class="column" v-if="!compatible">
            <button class="btn btn-block" @click="checkCompatibility()">Validate</button>
          </div>
          <div class="column" v-if="compatible">
            <button class="btn btn-block btn-primary" @click="newSchemaVersion()">Update</button>
          </div>
        </div>
      </Tab>
      <Tab name="Info">
        <Info :schema="schema" />
      </Tab>
      <Tab name="Config">
        <Config :config.sync="config" v-if="config" />

        <div class="columns mt-2">
          <div class="column">
            <button class="btn btn-block btn-primary" @click="setConfig()">Update</button>
          </div>
        </div>
      </Tab>
      <Tab name="Diff" :show="showDiff">
        <div class="columns mb-2">
          <div class="column">
            <div class="form-group">
              <select class="form-select select-sm" v-model="compareLeftVersion">
                <option v-for="version of versions" :key="version" :value="version">v{{version}}</option>
              </select>
            </div>
          </div>

          <div class="column">
            <div class="divider-vert"></div>
          </div>

          <div class="column">
            <div class="form-group">
              <select class="form-select select-sm" v-model="compareRightVersion">
                <option v-for="version of versions" :key="version" :value="version">v{{version}}</option>
              </select>
            </div>
          </div>
        </div>

        <SchemaDiffEditor
          :left="compareLeftSchema"
          :right="compareRightSchema"
          class="relative" />
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import SchemaEditor from '@/components/SchemaEditor.vue'
import SchemaDiffEditor from '@/components/SchemaDiffEditor.vue'
import Info from '@/views/schemas/Info.vue'
import Config from '@/views/schemas/Config.vue'

export default {
  components: {
    Tab,
    Tabs,
    SchemaEditor,
    SchemaDiffEditor,
    Info,
    Config
  },
  computed: {
    ...mapState('schemas', [
      'subjects',
      'configs'
    ]),
    schemas () {
      const {subject} = this.$route.params
      return this.subjects[subject] || {}
    },
    versions () {
      return Object.keys(this.schemas || {})
    },
    showDiff () {
      return this.versions.length > 1
    },
    latest () {
      return this.versions.length > 0 ? Math.max(...this.versions) : null
    },
    selected () {
      return this.version && this.schemas ? this.schemas[this.version] : null
    },
    compareLeftSchema () {
      const subject = this.schemas[this.compareLeftVersion]
      return subject ? subject.schema : {}
    },
    compareRightSchema () {
      const subject = this.schemas[this.compareRightVersion] || {}
      return subject.schema || {}
    }
  },
  watch: {
    selected () {
      if (!this.selected || !this.selected.schema) {
        return
      }

      this.schema = this.selected.schema
      this.config = this.configs[this.subject]
    },
    async versions () {
      await this.$store.dispatch('schemas/fetchAllVersions', this.subject)
    }
  },
  data () {
    const {subject} = this.$route.params
    return {
      subject,
      version: 0,
      schema: {},
      config: {},
      compareLeftVersion: 0,
      compareRightVersion: 0,
      compatible: false
    }
  },
  async created () {
    await this.$store.dispatch('schemas/fetchVersions', this.subject)
    await this.$store.dispatch('schemas/fetchConfig', this.subject)

    this.version = this.latest

    this.compareLeftVersion = this.versions.length > 1 ? this.latest - 1 : 0
    this.compareRightVersion = this.latest

    await this.$store.dispatch('schemas/fetchAllVersions', this.subject)
  },
  methods: {
    /**
     * Check the compatibility of the current schema.
     * If the schema is incompatible will a notification be thrown.
     */
    async checkCompatibility () {
      try {
        await this.$store.dispatch('schemas/checkCompatibilityLatest', {
          subject: this.subject,
          schema: this.schema
        })

        // TODO: send a notification

        this.compatible = true
      } catch (error) {
        // TODO: send a notification
        console.log(String(error))
      }
    },
    async setConfig () {
      await this.$store.dispatch('schemas/setConfig', {
        subject: this.subject,
        config: this.config
      })
    },
    async newSchemaVersion () {
      await this.$store.dispatch('schemas/newSchemaVersion', {
        subject: this.subject,
        schema: this.schema
      })

      this.version = this.latest
    }
  }
}
</script>
