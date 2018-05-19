<template>
  <div>
    <Schema id="1" name="test"/>
    <Schema id="2" name="test 2"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Schema from '@/components/Schema.vue'

export default {
  name: 'dashboard',
  components: {
    Schema
  }
}
</script>
