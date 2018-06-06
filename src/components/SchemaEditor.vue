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
  computed: {
    code () {
      return this.content
    }
  },
  mounted () {
    this.editor = Ace.edit(this.$refs.editor)
    this.editor.setOptions({
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      mode: 'ace/mode/json'
    })

    if (this.code) {
      this.setValue(this.code)
    }

    this.editor.session.on('change', () => {
      const content = this.editor.session.getValue()
      this.$emit('update:content', JSON.parse(content))
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
  }
}
</script>
