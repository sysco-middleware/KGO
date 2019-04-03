<template>
  <div ref="table" class="hotTable">
    <slot></slot>
  </div>
</template>

<script>
import Handsontable from 'handsontable'

export default {
  props: {
    messages: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      table: null,
      headers: [],
      rows: []
    }
  },
  mounted () {
    this.table = new Handsontable(this.$refs.table)
    this.updateTableData()
  },
  watch: {
    messages () {
      this.updateTableData()
    }
  },
  methods: {
    updateTableData () {
      this.headers = ['offset', 'partition']
      this.rows = []

      for (let message of this.messages) {
        let row = [message.offset, message.partition]

        const constructor = message.value ? message.value.constructor : String

        switch (constructor) {
          case Object:
            for (let key in message.value) {
              let index = this.headers.indexOf(key)
              if (index < 0) {
                index = this.headers.length
                this.headers.push(key)
              }

              row[index] = message.value[key]
            }
            break
          default:
            const key = 'value'
            let index = this.headers.indexOf(key)
            if (index < 0) {
              index = this.headers.length
              this.headers.push(key)
            }

            row[index] = String(message.value)
            break
        }

        this.rows.push(row)
      }

      this.table.updateSettings({
        colHeaders: this.headers,
        data: this.rows,
        rowHeaders: (index) => {
          const [offset] = this.rows[index]
          return offset
        },
        startRows: 5,
        startCols: 4,
        renderAllRows: true,
        outsideClickDeselects: false
      })

      // This is a chrome only feature
      try {
        const observer = new ResizeObserver(() => {
          this.table.render()
        })

        observer.observe(this.$refs.table)
      } catch (error) {}
    }
  }
}
</script>
