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
      rows: [],
      columns: []
    }
  },
  mounted () {
    this.table = new Handsontable(this.$refs.table, {
      colHeaders: this.headers,
      columns: this.columns,
      data: this.rows,
      rowHeaders: (index) => {
        const [offset] = this.rows[index]
        return offset
      },
      startRows: 5,
      startCols: 4
    })

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

        if (message.value) {
          switch (message.value.constructor) {
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
              break
          }
        }

        this.rows.push(row)
      }

      // All columns should be read only
      this.columns = this.headers.map((header) => {
        return {
          readOnly: true
        }
      })

      this.table.updateSettings({
        colHeaders: this.headers,
        columns: this.columns,
        data: this.rows
      })
    }
  }
}
</script>
