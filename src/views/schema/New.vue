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
          <Editor>{
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
}</Editor>
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
import Editor from '@/components/Editor.vue'
import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import Config from '@/views/schema/Config.vue'

export default {
  components: {
    Editor,
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
