<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white">
      <div class="panel-title h5 mt-10">New subject</div>
    </div>
    <div class="panel-body">
      <form class="form-horizontal">
        <div class="form-group">
          <input class="form-input" type="text" placeholder="Subject name">
        </div>

        <Editor />
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Editor from '@/components/Editor.vue'

export default {
  components: {
    Editor
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
