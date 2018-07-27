<template>
  <div ref="editor">
    <slot></slot>
  </div>
</template>

<script>
import Ace from 'brace'
import 'brace/mode/json'

export default {
  props: ['content'],
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.editor = Ace.edit(this.$refs.editor)
    this.editor.setOptions({
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      mode: 'ace/mode/json',
      editable: false
    })

    if (this.content) {
      this.setValue(this.content)
    }

    this.editor.on('blur', () => {
      const content = this.editor.session.getValue()
      if (!content) {
        return
      }

      const json = JSON.parse(content)
      this.$emit('update:content', json)
    })

    this.editor.on('change', () => {
      this.$emit('change')
    })
  },
  methods: {
    setValue (content) {
      content = this.prettyJSON(content)
      this.editor.session.setValue(content)
    },
    prettyJSON (json) {
      return JSON.stringify(json, null, '\t')
    }
  },
  watch: {
    content () {
      this.setValue(this.content)
    }
  }
}
</script>
