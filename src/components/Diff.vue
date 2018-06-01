<script>
import AceDiff from '@sysco-middleware/vue-ace-diff'
import 'brace/mode/json'

export default {
  extends: AceDiff,
  mounted () {
    this.createEditor({
      left: {
        editable: false
      },
      right: {
        editable: false
      },
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      mode: 'ace/mode/json'
    })
  }
}
</script>
