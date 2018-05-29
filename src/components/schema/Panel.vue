<template>
  <div class="panel">
    <div class="panel-header bg-primary text-white">
      <div class="columns flex-middle">
        <div class="column">
          <div class="panel-title h5 mt-10">Schema: events</div>
          <div class="panel-subtitle">ID: 1</div>
        </div>
        <div class="column">
          <div class="form-group text-dark">
            <select class="form-select select-sm">
              <option>v1</option>
              <option>v2</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <Tabs nav="panel-nav" body="panel-body">
      <Tab name="Schema">
        <Editor :content="code" />
      </Tab>
      <Tab name="Info">
        <table class="table table-striped table-scroll">
          <thead>
            <tr>
              <th>name</th>
              <th>type</th>
              <th>default</th>
              <th>documentation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>payment_type</td>
              <td>int</td>
              <td>0</td>
              <td>A numeric code signifying how the passenger paid for the trip. 1: Credit card 2: Cash 3: No charge 4: Dispute 5: Unknown 6: Voided trip</td>
            </tr>
            <tr>
              <td>trip_distance</td>
              <td>double</td>
              <td>0.0</td>
              <td>The elapsed trip distance in miles reported by the taximeter.</td>
            </tr>
            <tr>
              <td>tpep_dropoff_datetime</td>
              <td>string</td>
              <td></td>
              <td>The date and time when the meter was disengaged.</td>
            </tr>
          </tbody>
        </table>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
import Tab from '@/components/Tab.vue'
import Tabs from '@/components/Tabs.vue'
import Editor from '@/components/Editor'

export default {
  props: {
    name: String,
    id: String,
    versions: Array
  },
  components: {
    Tab,
    Tabs,
    Editor
  },
  data () {
    return {
      editor: null,
      code: `{
  "type": "record",
  "name": "events",
  "namespace": "com.sysco",
  "doc": "This is a sample Avro schema to get you started. Please edit",
  "fields": [
    {
      "name": "name",
      "type": "string"
    },
    {
      "name": "number1",
      "type": "int"
    },
    {
      "name": "number2",
      "type": "float"
    }
  ]
}`
    }
  },
  mounted () {
  }
}
</script>
