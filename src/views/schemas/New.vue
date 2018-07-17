<template>
  <div class="panel">
    <Tabs nav="panel-nav" body="panel-body">
      <Tab name="Schema">
        <div class="form-group">
          <label class="form-label" for="subject-name">Subject name</label>
          <input class="form-input" id="subject-name" placeholder="" v-model="name">
        </div>

        <div class="form-group">
          <label class="form-label">Schema</label>
          <!-- eslint-disable -->
<SchemaEditor>{
	"type": "record",
	"name": "",
	"namespace": "",
	"doc": "",
	"fields": [
		{
			"name": "example",
			"type": "string"
		}
	]
}</SchemaEditor>
          <!-- eslint-enable -->
        </div>
      </Tab>
      <Tab name="Config">
        <Config />
      </Tab>
    </Tabs>
    <div class="panel-footer">
      <button class="btn btn-block">Save</button>
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
      name: ''
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>
