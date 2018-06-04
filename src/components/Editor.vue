<template>
  <div>
    <div :id="id">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Ace from 'brace'
import 'brace/mode/json'

export default {
  props: {
    id: {
      default: 'ace',
      type: String
    },
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null
    }
  },
  watch: {
    content () {
      if (!this.editor) {
        return
      }

      this.setValue(this.content)
    }
  },
  mounted () {
    this.editor = Ace.edit(this.id)
    this.editor.setOptions({
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      mode: 'ace/mode/json'
    })

    if (this.content) {
      this.setValue(this.content)
    }
  },
  methods: {
    setValue (code) {
      if (!this.editor) {
        return
      }

      this.editor.session.setValue(code)
    }
  }
}
</script>
