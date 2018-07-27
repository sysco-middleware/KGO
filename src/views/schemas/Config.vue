<template>
  <div class="form-group">
    <label class="form-label">Schema uses the global compatibility level <b>[{{level}}]</b><br>Change compatibility level to:</label>
    <select class="form-select" v-model="level">
      <option class="c-hand" value="none">None</option>
      <option class="c-hand" value="full">Full</option>
      <option class="c-hand" value="forward">Forward</option>
      <option class="c-hand" value="backward">Backward</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    schema: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    config () {
      const schema = this.schema
      return schema.config || {}
    },
    level () {
      return this.config.level || 'none'
    }
  }
}
</script>
