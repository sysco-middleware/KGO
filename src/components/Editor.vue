<script>
import Ace from '@sysco-middleware/vue-ace'
import 'brace/mode/json'

export default {
  extends: Ace,
  mounted () {
    this.createEditor({
      showPrintMargin: false,
      tabSize: 2,
      useSoftTabs: true,
      mode: 'ace/mode/json'
    })
  }
}
</script>
