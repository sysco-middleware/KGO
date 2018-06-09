<template>
  <div ref="editor" class="acediff__container">
  </div>
</template>

<script>
import AceDiff from 'ace-diff'
import 'brace/mode/json'

export default {
  props: [
    'left',
    'right'
  ],
  data () {
    return {
      editor: null
    }
  },
  computed: {
    prettyLeft () {
      return this.prettyJSON(this.left)
    },
    prettyRight () {
      return this.prettyJSON(this.right)
    }
  },
  mounted () {
    this.editor = new AceDiff({
      element: this.$refs.editor,
      left: {
        content: this.prettyLeft || '',
        editable: false
      },
      right: {
        content: this.prettyRight || '',
        editable: false
      },
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      mode: 'ace/mode/json'
    })
  },
  watch: {
    left () {
      const {left} = this.editor.getEditors()
      left.setValue(this.prettyLeft, 1)
    },
    right () {
      const {right} = this.editor.getEditors()
      right.setValue(this.prettyRight, 1)
    }
  },
  methods: {
    prettyJSON (json) {
      return JSON.stringify(json, null, '\t')
    }
  }
}
</script>
