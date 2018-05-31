<template>
  <div class="ace_editor relative" :id="id"></div>
</template>

<script>
import AceDiff from 'ace-diff'
import 'brace/mode/json'

export default {
  props: {
    id: {
      type: String,
      default: 'diff'
    },
    left: String,
    right: String
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
      }
    })
  },
  destroyed () {
    this.editor.destroy()
  },
  watch: {
    left () {
      const {left} = this.editor.getEditors()
      left.setValue(this.left)
    },
    right () {
      const {right} = this.editor.getEditors()
      right.setValue(this.right)
    }
  }
}
</script>
