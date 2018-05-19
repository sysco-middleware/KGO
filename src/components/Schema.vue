<template>
  <div class="cp-schema">
    Confluent schema: (#{{id}}) {{name}}
  </div>
</template>

<script>
export default {
  name: 'Schema',
  props: {
    name: String,
    id: String
  }
}
</script>
