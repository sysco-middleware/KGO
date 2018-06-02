<template>
  <div :id="id" class="acediff__container">
  </div>
</template>

<script>
import AceDiff from 'ace-diff'
import 'brace/mode/json'

export default {
  props: {
    id: {
      type: String,
      default: 'ace-diff'
    },
    left: {
      type: String,
      default: ''
    },
    right: {
      type: String,
      default: ''
    },
    mode: String
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.editor = new AceDiff({
      element: `#${this.id}`,
      left: {
        content: this.left,
        editable: false
      },
      right: {
        content: this.right,
        editable: false
      },
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      mode: this.mode
    })
  }
}
</script>
