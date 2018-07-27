<template>
  <div>
    <div class="card">
      <div class="card-header">
        <div class="tile-title" v-if="schema.type"><b>Type:</b> {{schema.type}}</div>
        <div class="tile-title" v-if="schema.record"><b>Record:</b> {{schema.record}}</div>
        <div class="tile-title" v-if="schema.namespace"><b>Namespace:</b> {{schema.namespace}}</div>
      </div>
      <div class="card-body text-gray" v-if="schema.doc">
        {{schema.doc}}
      </div>
    </div>

    <table class="table table-striped table-scroll table-inline">
      <thead>
        <tr>
          <th>name</th>
          <th>type</th>
          <th>default</th>
          <th>documentation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) of fields" :key="index">
          <td>{{row.name}}</td>
          <td>{{row.type}}</td>
          <td>{{row.default}}</td>
          <td>{{row.doc}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  computed: {
    fields () {
      const fields = this.schema.fields.map(function (field) {
        field.type = Array.isArray(field.type) ? field.type.join(', ') : field.type
        return field
      })

      return fields
    }
  }
}
</script>
