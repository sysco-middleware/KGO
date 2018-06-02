<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white text-center">
      <div class="panel-title h5 mt-10">New Subject</div>
    </div>
    <Tabs nav="panel-nav" body="panel-body">
      <Tab name="Schema">
        <Editor />
      </Tab>
      <Tab name="Config">
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Editor from '@/components/Editor.vue'
import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'

export default {
  components: {
    Editor,
    Tab,
    Tabs
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>
