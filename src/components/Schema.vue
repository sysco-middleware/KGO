<template>
  <div class="cp-schema">
    Schema user: (#{{id}}) {{name}}
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
