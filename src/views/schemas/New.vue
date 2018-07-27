<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white">
      <div class="columns f-middle">
        <div class="column">
          <div class="panel-title h5 mt-10">New subject<span v-show="name">: {{name}}</span></div>
        </div>
      </div>
    </div>

    <Tabs nav="panel-nav" body="panel-body">
      <Tab name="Schema">
        <div class="form-group">
          <label class="form-label" for="subject-name">Subject name</label>
          <input class="form-input" id="subject-name" placeholder="" v-model="name">
        </div>

        <div class="form-group">
          <label class="form-label">Schema</label>
          <SchemaEditor :content.sync="schema" />
        </div>
      </Tab>
      <Tab name="Config">
        <Config :config.sync="config" />
      </Tab>
    </Tabs>
    <div class="panel-footer">
      <button class="btn btn-block" @click="newSchemaVersion()">Save</button>
    </div>
  </div>
</template>

<script>
import SchemaEditor from '@/components/SchemaEditor.vue'
import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import Config from '@/views/schemas/Config.vue'

export default {
  components: {
    SchemaEditor,
    Tab,
    Tabs,
    Config
  },
  data () {
    return {
      name: '',
      config: null,
      schema: {
        type: 'record',
        name: '',
        namespace: '',
        doc: '',
        fields: [
          {
            name: 'example',
            type: 'string'
          }
        ]
      }
    }
  },
  methods: {
    async newSchemaVersion () {
      const subject = this.name

      await this.$store.dispatch('schemas/newSchemaVersion', {
        subject,
        schema: this.schema
      })

      if (this.config) {
        await this.$store.dispatch('schemas/setConfig', {
          subject,
          config: this.config
        })
      }

      this.$router.push({
        name: 'schema',
        params: {
          subject
        }
      })
    }
  }
}
</script>
